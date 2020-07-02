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
import GraphicsLayer from "esri/layers/GraphicsLayer"
import Graphic from "esri/Graphic";
import {fromJSON} from "esri/symbols/support/jsonUtils";
import ct_array from "ct/array";
import ct_equal from "ct/_equal";

export default function () {
    return {
        //injected
        _zoomToHandler: null,
        _mapWidgetModel: null,

        //props
        pointSymbol: null,
        polygonSymbol: null,
        polylineSymbol: null,
        highlightLayerId: null,
        highlightContext: null,

        //local
        _highlightGraphicLayer: null,

        activate() {
            const props = this._properties;
            this.id = props.id || "highlightHandler";

            this.pointSymbol = fromJSON(props.pointSymbol);
            this.polygonSymbol = fromJSON(props.polygonSymbol);
            this.polylineSymbol = fromJSON(props.polylineSymbol);

            this.zoomToHighlight = props.zoomToHighlight;
            this.highlightLayerId = props.highlightLayerId || "_highlightGraphicLayer_";
            this.highlightContext = props.highlightContext || {highlight: true};
            // this._mapWidgetModel.map.allLayers.on("change", d_lang.hitch(this, this._onLayerChangeHandler));
        },
        deactivate() {
        },

        addHighlightFeatures(evt) {
            const context = evt.getProperty("context");
            const features = evt.getProperty("features");
            const geometries = features && features.map(feature => {
                return feature.geometry;
            });

            return geometries && this._addGraphicsByGeometry(geometries, context);
        },

        removeHighlightFeatures(evt) {
            const context = evt.getProperty("context") || this.highlightContext;
            const features = evt.getProperty("features");
            const layer = this._getLayer();
            const graphics = layer.graphics.items.filter(graphic => {
                const attr = graphic.attributes;
                return !!ct_array.arraySearchFirst(features, feature => {
                    return feature.objectid ? feature.objectid === attr.objectid : feature.id === attr.id;
                });
            });
            this._removeHighlightGraphics(graphics, context);
        },

        removeHighlightGraphics(evt) {
            const context = evt.getProperty("context") || this.highlightContext;
            const graphics = evt.getProperty("Graphics");
            this._removeHighlightGraphics(graphics, context);
        },

        addGraphics(evt) {
            const context = evt.getProperty("context") || this.highlightContext;
            const graphics = evt.getProperty("Graphics");
            const layer = this._getLayer();
            const aGraphics = graphics.map(graphic => {
                const g = graphic.clone();
                g.context = context;
                g.symbol || (g.symbol = this._getSymbol(g.geometry));
                g.layer = layer;
                return g;
            });

            layer.addMany(aGraphics);
            this._zoomTo(aGraphics);
            return aGraphics;
        },

        addGraphicsByGeometry(evt) {
            const context = evt.getProperty("context");
            const geometries = evt.getProperty("geometries");
            return this._addGraphicsByGeometry(geometries, context);
        },

        _addGraphicsByGeometry(geometries, context) {
            const graphics = geometries.map(geometry => {
                return this._createGraphic(geometry, context);
            }, this);

            this._getLayer().addMany(graphics);
            this._zoomTo(graphics);
            return graphics;
        },

        _createGraphic(geometry, context, symbol) {
            symbol || (symbol = this._getSymbol(geometry));
            context || (context = this.highlightContext);
            return new Graphic({
                symbol: symbol,
                context: context,
                geometry: geometry,
                layer: this._getLayer()
            });
        },

        removeGraphics(evt) {
            const graphics = evt.getProperty("Graphics");
            this._removeGraphics(graphics);
        },

        clearHighlight(context) {
            const layer = this._getLayer();
            this._removeHighlightGraphics(layer.graphics.items, context || this.highlightContext);
        },

        clearGraphics() {
            this._getLayer().removeAll();
        },

        addManyGraphics(graphics) {
            this._getLayer().addMany(graphics);
        },

        _removeHighlightGraphics(graphics, context) {
            return this._removeGraphics(this._filterGraphics(graphics, context));
        },

        _removeGraphics(graphics) {
            return this._getLayer().removeMany(graphics);
        },

        _getLayer() {
            if (!this._highlightGraphicLayer) {
                const map = this._mapWidgetModel.map;
                const layerId = this.highlightLayerId;
                this._highlightGraphicLayer = map.findLayerById(layerId);
                if (!this._highlightGraphicLayer) {
                    let layer = this._highlightGraphicLayer = new GraphicsLayer({
                        id: layerId,
                        listMode: "hide",
                        spatialReference: this._mapWidgetModel.spatialReference
                    });
                    map.add(layer);
                }
            }
            return this._highlightGraphicLayer;
        },

        _zoomTo(graphics) {
            this.zoomToHighlight && this._zoomToHandler && this._zoomToHandler._zoomToGraphics(graphics);
        },

        _filterGraphics(graphics, context) {
            return (graphics || []).filter(graphic => {
                return ct_equal.equalsProps(context, graphic.context);
            });
        },

        _getSymbol: function (geometry) {
            return this[geometry.type + "Symbol"] || this.pointSymbol;
        }

        //todo: move to bundle layerreorder
        //
        // _getParentLayers(layer) {
        //     const parent = layer.parent;
        //     return parent ? parent.layers || parent.layer.layers || parent.layer.sublayers : layer.view.map.layers;
        // },
        // _onLayerChangeHandler() {
        //     const map = this._mapWidgetModel.map;
        //     const layer = map.findLayerById(this.highlightLayerId);
        //     if (layer) {
        //         const parentLayers = this._getParentLayers(layer);
        //         parentLayers.reorder(layer, parentLayers.length - 1);
        //     }
        // }
    }
}
