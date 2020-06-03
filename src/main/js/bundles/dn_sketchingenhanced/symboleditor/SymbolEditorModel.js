/*
 * Copyright (C) 2020 con terra GmbH (info@conterra.de)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * In map.apps version ^4.8.4 is a new method "notifyChange" in "apprt-core/Mutable". Replace the revision variable with a notify call
 */
import {declare} from 'apprt-core/Mutable';
import UniqueValueRenderer from 'esri/renderers/UniqueValueRenderer';
import EsriTransformer from './model/EsriTransformer';
import SymbolSettings from './SymbolSettings';
import ScaleSettings from './ScaleSettings';
import LabelSettings from './LabelSettings';
import LayerSettings from './LayerSettings';

export default declare({
    _esriTransformer: new EsriTransformer(),
    layerID: null,
    revision: 0,
    scaleSettings: {value: new ScaleSettings()},
    labelSettings: {value: new LabelSettings()},
    symbolSettings: {value: new SymbolSettings()},
    activeEditor: 0,
    appliedState: {value: new LayerSettings()},

    /**
     * Create a simple renderer and assign it to the selected layer
     */
    _simpleRenderer(symbol) {
        // create a symbol object for the simple renderer with the selected fill style, the selected fill color and the outline symbol
        return {
            type: 'simple',
            symbol,
        };
    },


    async applyLabeling(labelSettings) {
        if (!labelSettings.allowed) {
            return;
        }

        const selectedLayer = this.registry.getLayerFromMap(this);
        const sublayer = selectedLayer.sublayers.items[0];
        const fl = await this.registry._getFeatureLayer(this);

        if (labelSettings.enabled) {
            sublayer.labelingInfo = fl.labelingInfo.map(i => ({
                minScale: i.minScale,
                maxScale: i.maxScale,
                symbol: i.symbol,
                labelPlacement: i.labelPlacement,
                where: i.where,
                labelExpression: `[${labelSettings.fieldForLabeling}]`,
            }));

            sublayer.labelsVisible = labelSettings.visible;
            this.appliedState.labelSettings = new LabelSettings(labelSettings);
            this.revision++;
            return;
        }

        sublayer.labelingInfo = fl.labelingInfo;
        /**
         * @var {ConfiguredLayer}
         */
        const config = await this.registry.getLayerConfig(this);
        sublayer.labelsVisible = !!config.showLabelByDefault;

        this.appliedState.labelSettings = new LabelSettings({
            ...labelSettings,
            fieldForLabeling: labelSettings.defaultField,
            visible: sublayer.labelsVisible,
        });
        this.revision++;
    },

    /**
     *
     * @param {ScaleSettings} scaleSettings
     */
    applyScaling(scaleSettings) {
        const selectedLayer = this.registry.getLayerFromMap(this);
        const sublayer = ['imagery', 'wms', 'feature', 'graphics'].includes(selectedLayer.type) ? selectedLayer : selectedLayer.sublayers.items[0];

        if (scaleSettings.enabled) {
            if (scaleSettings.minScale === 0) {
                sublayer.minScale = scaleSettings.minScale;
            } else {
                sublayer.minScale = scaleSettings.minScale + 1;
            }

            if (scaleSettings.maxScale === 0) {
                sublayer.maxScale = scaleSettings.maxScale;
            } else {
                sublayer.maxScale = scaleSettings.maxScale - 1;
            }

            this.appliedState.scaleSettings = new ScaleSettings(scaleSettings);
            this.revision++;
            return;
        }
        // return to service defaults
        sublayer.minScale = scaleSettings.defaults.minScale;
        sublayer.maxScale = scaleSettings.defaults.maxScale;

        this.appliedState.scaleSettings = new ScaleSettings({
            ...scaleSettings,
            minScale: sublayer.minScale,
            maxScale: sublayer.maxScale,
        });
        this.revision++;
    },

    /**
     *
     * @param {SymbolSettings} symbolSettings
     * @param {boolean} withToast
     */
    async applySymboling(symbolSettings, withToast = true) {
        if (!symbolSettings.allowed) {
            return;
        }
        const selectedLayer = this.registry.getLayerFromMap(this);

        if (symbolSettings.enabled) {
            // distinguish graphics- from other layers
            if(selectedLayer.type === 'graphics') {
                this._applySymbolingGraphicsLayer(selectedLayer, symbolSettings);
            }
            else {
                let renderer = null;

                if (symbolSettings.type === 'single') {
                    const symbol = this._esriTransformer.transformToEsri(symbolSettings.defaultSymbol);
                    renderer = this._simpleRenderer(symbol);
                } else {
                    const uniqueValueRenderer = new UniqueValueRenderer({
                        field: symbolSettings.fieldForSymbology === 'server-categories' ? symbolSettings.defaultCategory : symbolSettings.fieldForSymbology,
                    });

                    symbolSettings.categories.forEach(category => {
                        const symbol = this._esriTransformer.transformToEsri(category.symbol);
                        const {value, label} = category;
                        uniqueValueRenderer.addUniqueValueInfo({value, symbol, label});
                    });

                    uniqueValueRenderer.defaultSymbol = this._esriTransformer.transformToEsri(symbolSettings.defaultSymbol);
                    renderer = uniqueValueRenderer;
                }

                renderer.layerId = this.id;
                selectedLayer.sublayers.items[0].renderer = renderer;
            }

            this.appliedState.symbolSettings = new SymbolSettings(symbolSettings);
            this.revision++;
            withToast && this._toastLayerEdited(this.registry);
            return;
        }

        const fl = await this.registry._getFeatureLayer(this);
        if(selectedLayer.sublayers) {
            selectedLayer.sublayers.items[0].renderer = null;
        }

        // revert to original symbol
        const x = await this.registry._transform(fl, await this.registry.getLayerConfig(this));
        this.appliedState.symbolSettings = new SymbolSettings(x.symbolSettings);
        this.revision++;
        withToast && this._toastLayerEdited();
    },

    /**
     * Apply symbol to graphicslayer
     * @param layer
     * @param symbolSettings
     * @private
     */
    _applySymbolingGraphicsLayer(layer, symbolSettings) {
        // transform symbol
        const newSymbol = this._esriTransformer.transformToEsri(symbolSettings.defaultSymbol);

        if (layer.graphics && layer.graphics.items && layer.graphics.items.length > 0) {
            const graphicItems = layer.graphics.items;
            const geometryType = graphicItems[0].geometry.type;

            // ensure only graphics with same geometrytype are given
            const singleGeometryTypeGiven = graphicItems.every(item => item.geometry.type === geometryType);

            if (singleGeometryTypeGiven && geometryType === symbolSettings.geometryType) {
                graphicItems.forEach(item => {
                    // set new symbol
                    item.symbol = newSymbol;
                });

                // send event to notify data_source_my_geodata about a change of the layer
                this.registry._eventService && this.registry._eventService.postEvent('dsa/symbolEditor/graphicsLayerChanged', {layer});
            }
        }
    },

    _toastLayerEdited() {
        const logService = this.registry._logService;
        const layerEditedInfoLog = this.registry._i18n && this.registry._i18n.get().ui.layerEditedInfoLog;
        logService && logService.toast(layerEditedInfoLog);
    },
});
