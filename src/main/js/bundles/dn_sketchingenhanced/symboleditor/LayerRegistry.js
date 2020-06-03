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
import FeatureLayer from 'esri/layers/FeatureLayer';
import LayerSettings from './LayerSettings';
import {whenOnce} from 'esri/core/watchUtils';
import PointSetting from './model/PointSetting';
import LineSetting from './model/LineSetting';
import PolygonSetting from './model/PolygonSetting';
import SymbolCategory from './model/SymbolCategory';
import LayerCategory from './model/LayerCategory';
import Query from 'esri/tasks/support/Query';
import QueryTask from 'esri/tasks/QueryTask';
import ColorSetting from './model/ColorSetting';
import LayerRegistryList from './model/LayerRegistryList';
import LayerRegistryItem from './model/LayerRegistryItem';
import SymbolEditorModel from './SymbolEditorModel';
import ScaleSettings from './ScaleSettings';
import LabelSettings from './LabelSettings';
import SymbolSettings from './SymbolSettings';

class LayerRegistry {

    constructor() {
        this.scales = [];

        /**
         *
         * @type {[LayerCategory]}
         */
        this._categories = [];

        this._allLayers = new LayerRegistryList();

        this.models = [];
    }

    /**
     * Returns all registered Layers
     * @return {LayerRegistryItem[]}
     */
    getAllLayers() {
        return this._allLayers.getAll();
    }

    /**
     * Returns a LayerRegistryItem from the registry
     * @param layerInfo
     * @return {LayerRegistryItem}
     * @private
     */
    _getCachedLayer(layerInfo) {
        return this._allLayers.get(layerInfo);
    }

    async _getFeatureLayer(layerInfo) {
        await this.getLayer(layerInfo);
        return this._getCachedLayer(layerInfo).layer;
    }

    /**
     * Returns a layer from the mapWidgetModel
     * @param layerInfo
     * @return {*}
     */
    getLayerFromMap(layerInfo) {
        let layer;
        this._mapWidgetModel.map.layers.items.every(item => {
            if (item.type === 'group') {
                layer = item.layers.find(x => x.id === layerInfo.id && x.dataSourceTitle === layerInfo.source);
            } else {
                if (item.id === layerInfo.id && item.dataSourceTitle === layerInfo.source) {
                    layer = item;
                }
            }
            return !layer;
        });

        return layer;
    }

    getLayerConfig(layerInfo) {
        const source = this._mapContentSources.find(x => x.title() === layerInfo.source);
        if (source) {
            const layers = source.getLayersConfig();
            const group = layers.find(x => (x.children || []).find(child => child.id === layerInfo.id));

            if (group) {
                return group.children.find(child => child.id === layerInfo.id);
            }
            else {
                return layers.find(layer => layer.id === layerInfo.id);
            }
        }

        return null;
    }

    async _getEditableLayer(layer, config) {
        if (layer.type !== 'map-image') {
            return layer;
        }

        const featureLayer = new FeatureLayer({
            url: config.url,
            id: config.id,
        });

        await featureLayer.load();
        return featureLayer;
    }

    async getLayer(layerInfo) {
        const cached = this._getCachedLayer(layerInfo);
        if (cached && cached.layer) {
            return cached.settings;
        }

        return await new Promise(resolve => {
            const a = this.getLayerFromMap(layerInfo);
            whenOnce(a, 'loaded', async () => {
                const config = await this.getLayerConfig(layerInfo);
                const layer = await this._getEditableLayer(a, config);
                const nowFound = this._getCachedLayer(layerInfo);

                if (cached) {
                    this._getCachedLayer(layerInfo).layer = layer;
                    return resolve(cached.settings);
                }
                if (!nowFound) {
                    const settings = await this._transform(layer, config);
                    settings.source = layerInfo.source;
                    settings.appliedState = new LayerSettings(settings);
                    this._allLayers.add(new LayerRegistryItem(settings, layer));
                    return resolve(settings);
                } else {
                    nowFound.layer = layer;
                    return resolve(nowFound.settings);
                }


            });
        });
    }

    /**
     *
     * @param layer
     * @param {ConfiguredLayer} config
     * @return {Promise<SymbolEditorModel>}
     * @private
     */
    async _transform(layer, config) {
        const settings = new SymbolEditorModel();
        settings.registry = this;
        settings.scaleSettings = new ScaleSettings();
        settings.labelSettings = new LabelSettings();
        settings.symbolSettings = new SymbolSettings();

        settings.id = layer.id;

        settings.scaleSettings.defaults.minScale = layer.minScale;
        settings.scaleSettings.defaults.maxScale = layer.maxScale;
        settings.scaleSettings.scales = this.scales.slice(0);

        // MapImageLayer, FeatureLayer
        if (layer.fields) {
            this._loadLayerSettings(layer, config, settings);
        }
        // GraphicsLayer
        else if (layer.type === 'graphics') {
            this._loadGraphicsSettings(layer, config, settings);
        }

        return settings;
    }

    /**
     * Load settings to a given non-graphics layer
     * @param layer
     * @param config
     * @param settings
     * @private
     */
    _loadLayerSettings(layer, config, settings) {
        this._loadLabelSettings(settings.labelSettings, layer, config);

        settings.symbolSettings.geometryType = layer.geometryType;
        settings.symbolSettings.allowed = !!config.changeSymbologyAllowed;

        if (config.allowedFieldsForSymbology.length > 0) {
            settings.symbolSettings.fields = config.allowedFieldsForSymbology.map(f => ({name: f, alias: f}));
        } else {
            settings.symbolSettings.fields = [];
        }

        if (layer.renderer) {
            const renderer = layer.renderer;
            const defaultSymbol = renderer.defaultSymbol || renderer.symbol;
            if (!['simple', 'unique-value'].includes(renderer.type)) {
                // no valid render type
                settings.symbolSettings.allowed = false;
            }

            settings.symbolSettings.fieldForSymbology = renderer.field;

            if (renderer.type === 'unique-value') {
                settings.symbolSettings.type = 'category';

                renderer.uniqueValueInfos.forEach(infos => {
                    if (infos.symbol.type === 'picture-marker') {
                        settings.symbolSettings.warning = true;
                    }

                    const category = new SymbolCategory(infos.value, infos.label);
                    category.symbol = this.addSymbolSettings([], layer.geometryType, infos.symbol);

                    settings.symbolSettings.categories.push(category);
                });

                if (settings.symbolSettings.categories.length > 0) {
                    settings.symbolSettings.fields.unshift({
                        name: 'server-categories',
                        'alias': renderer.field + ' (Standard Visualisierung)',
                    });

                    this._categories.push(new LayerCategory('server-categories', 'server-categories', settings.symbolSettings.categories));

                    settings.symbolSettings.fieldForSymbology = 'server-categories';
                    settings.symbolSettings.defaultCategory = renderer.field;
                }

                if (defaultSymbol) {
                    settings.symbolSettings.defaultSymbol = this.addSymbolSettings([], layer.geometryType, defaultSymbol);
                } else {
                    settings.symbolSettings.defaultSymbol = this.addSymbolSettings([], layer.geometryType, {});
                }

            } else if (renderer.type === 'simple') {
                settings.symbolSettings.type = 'single';

                if (defaultSymbol) {
                    if (defaultSymbol.type === 'picture-marker') {
                        settings.symbolSettings.warning = true;
                    }

                    settings.symbolSettings.defaultSymbol = this.addSymbolSettings([], layer.geometryType, defaultSymbol);
                }
            } else {
                // unknown renderer type
            }
        }

        // add default Label to output settings
        if (settings.symbolSettings && settings.symbolSettings.defaultSymbol && layer.renderer && layer.renderer.defaultLabel) {
            settings.symbolSettings.defaultSymbol.defaultLabel = layer.renderer.defaultLabel;
        }
    }

    /**
     * Load the settings for a GraphicsLayer
     * @param layer
     * @param config
     * @param settings
     * @private
     */
    _loadGraphicsSettings(layer, config, settings) {
        // get geometry type
        if (layer.graphics && layer.graphics.items && layer.graphics.items.length > 0) {
            const graphicItems = layer.graphics.items;
            const geometryType = graphicItems[0].geometry.type;

            // ensure only graphics with same geometrytype are given
            if (graphicItems.every(item => item.geometry.type === geometryType)) {
                settings.symbolSettings.geometryType = geometryType;
                settings.symbolSettings.allowed = !!config.changeSymbologyAllowed;

                // no fields for symbology given
                settings.symbolSettings.fields = [];

                // get symbol
                const symbol = graphicItems[0].symbol;
                settings.symbolSettings.type = 'single';
                settings.symbolSettings.defaultSymbol = this.addSymbolSettings([], geometryType, symbol);
            }
        }
    }

    _loadLabelSettings(labelSettings, layer, config) {
        labelSettings.fields = this._getFieldsFromLayer(layer);

        if (config.allowedFieldsForLabeling.length > 0) {
            labelSettings.fields = config.allowedFieldsForLabeling
                .filter(f => this._fieldExistsInLayer(layer, f))
                .map(f => ({name: f, alias: f}));
        }

        if (layer.labelingInfo && layer.labelingInfo[0]) {
            // layer has labeling
            const labelingInfo = layer.labelingInfo[0];
            labelSettings.minScale = labelingInfo.minScale;
            labelSettings.maxScale = labelingInfo.maxScale;

            const match = /\[(\S+)]/.exec(labelingInfo.labelExpression);
            if (match && this._fieldExistsInLayer(layer, match[1])) {
                labelSettings.defaultField = match[1];
            }
        } else {
            labelSettings.warning = true;
        }

        if (labelSettings.defaultField && !labelSettings.fields.some(x => x.name === labelSettings.defaultField)) {
            // default field is not in list -> add it
            labelSettings.fields.push({
                name: labelSettings.defaultField,
                alias: labelSettings.defaultField,
            });
        }

        if (!labelSettings.defaultField && labelSettings.fields.length > 0) {
            labelSettings.defaultField = labelSettings.fields[0].name;
        }

        labelSettings.visible = !!config.showLabelByDefault;
        labelSettings.allowed = this._isLabelingAllowed(labelSettings, config);
        labelSettings.fieldForLabeling = labelSettings.defaultField;
    }

    /**
     * Returns if labeling is allowed by config and loaded settings
     * @param {LabelSettings} labelSettings
     * @param {ConfiguredLayer} config
     * @return {boolean}
     * @private
     */
    _isLabelingAllowed(labelSettings, config) {
        // labeling is allowed when its configurated and a defaultField is set
        return !!config.labelingAllowed && !!labelSettings.defaultField;
    }

    /**
     *
     * @param {FeatureLayer} layer
     * @return {*[]}
     * @private
     */
    _getFieldsFromLayer(layer) {
        // return fields with valid types (defined by DSA3)
        return layer.fields
            .filter(x => ['oid', 'date', 'double', 'integer', 'small-integer', 'string'].includes(x.type))
            .map(f => ({name: f.name, alias: f.alias}));
    }

    async getUniqueValues(layerInfo, categoryName) {
        const cached = this._categories.find(x => x.name === categoryName);

        if (cached) {
            return cached.values;
        }

        const layer = await this._getFeatureLayer(layerInfo);
        // check if field exists in layer
        if (categoryName !== 'server-categories' && !this._fieldExistsInLayer(layer, categoryName)) {
            throw {message: 'FIELD_NOT_IN_LAYER'};
        }

        const result = await this._getUniqueValuesFromQuery(layer, categoryName);

        const category = (result || []).filter(x => !!x.value).map(
            x => new SymbolCategory(x.value, x.label || x.value, this.addSymbolSettings([], layer.geometryType, {})));
        if (category) {
            this._categories.push(new LayerCategory(categoryName, categoryName, category));
        }
        return category;
    }

    _fieldExistsInLayer(layer, field) {
        return !!layer.fields.find(x => x.name === field);
    }

    async _getUniqueValuesFromQuery(layer, categoryName) {
        const field = categoryName;
        const url = layer.url;

        //Create a query that returns the distinct values only for the selected field and doesn't return the geometry
        const query = new Query();
        const queryTask = new QueryTask(url + '/' + layer.layerId);
        query.where = '1=1';
        query.returnGeometry = false;
        query.outFields = [field];
        query.returnDistinctValues = true;

        const result = await queryTask.execute(query);

        if (!result) {
            return [];
        }

        const features = result.features;
        return features.map(f => ({value: f.attributes[field]}));
    }

    addSymbolSettings(settings, geometryType, symbol) {
        //TODO: Rename function
        let newSetting = null;
        switch (geometryType) {
            case 'point':
            case 'multipoint':
                newSetting = this.getPointSetting(symbol);
                break;

            case 'polyline':
                newSetting = this.getLineSetting(symbol);
                break;

            default:
                newSetting = this.getPolygonSetting(symbol);
        }

        return newSetting;
    }

    getPointSetting(symbol) {
        const setting = new PointSetting();
        if (symbol.color) {
            setting.color = new ColorSetting(symbol.color);
        }
        if (symbol.type === 'simple-marker') {
            setting.radius = symbol.size;
            setting.shape = symbol.style;
            setting.outline = new LineSetting(symbol.outline);
        }

        if (symbol.type === 'picture-marker') {
            setting.url = symbol.source.url;
        }

        return setting;
    }

    getPolygonSetting(symbol) {
        const setting = new PolygonSetting();

        if (symbol.outline) {
            setting.outline = this.getLineSetting(symbol.outline);
        }

        if (symbol.color) {
            setting.color = new ColorSetting(symbol.color);
        }

        if (symbol.type === 'simple-fill') {
            setting.style = symbol.style;
        }

        return setting;
    }

    getLineSetting(symbol) {
        const setting = new LineSetting();
        if (symbol.color) {
            setting.color = new ColorSetting(symbol.color);
        }
        if (symbol.type === 'simple-line') {
            setting.width = symbol.width;
            setting.style = symbol.style;
        }

        return setting;
    }

    _getScales() {
        return new Promise(r => {
            whenOnce(this._mapWidgetModel, 'ready', () => {
                whenOnce(this._mapWidgetModel.view, 'ready', () => {
                    // add event handler when layers are removed
                    this._mapWidgetModel.view.on('layerview-destroy', event => this._removeLayerSettings(event.layer));

                    // TODO This code is the same as in scale_changer ... refactor it
                    if (this._mapWidgetModel.view.constraints.lods) {
                        // when the level of details are configured, take them
                        this.scales = this._mapWidgetModel.view.constraints.lods.map(x => x.scale);
                    } else {
                        // as a fallback use the scales of the first baselayer
                        this.scales = this._mapWidgetModel.map.basemap.baseLayers.items[0].tileInfo.scales;
                    }
                    r(this.scales);
                });
            });
        });
    }

    /**
     * Remove settings of a layer
     * @param layer
     * @private
     */
    _removeLayerSettings(layer) {
        this._allLayers.remove({id: layer.id, source: layer.dataSourceTitle});
    }
}

export default LayerRegistry;
