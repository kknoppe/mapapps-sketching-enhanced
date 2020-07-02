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
/*** SKIP-SONARQUBE-ANALYSIS ***/
/*
 * Copyright (C) con terra GmbH
 */
import d_lang from "dojo/_base/lang";
import Handles from "esri/core/Handles";
import Polyline from "esri/geometry/Polyline";
import {declare} from "apprt-core/Mutable";
import ct_async from "ct/async";

export default declare({
    //injected
    _toggleTools: [],
    _mapWidgetModel: null,

    //local
    _geometries: [],
    _ownHandler: new Handles(),
    _queryFeaturesTimer: null,

    activate() {
        const props = this._properties;
        this.maxLength = props.maxLength || 0;
    },
    deactivate() {
        this._ownHandler.removeAll();
    },

    set_mapWidgetModel(mapWidgetModel) {
        this._mapWidgetModel = mapWidgetModel;
        ct_async(this._addMapWidgetModelHandler, this);
    },

    add_toggleTool(toggleTool) {
        this._toggleTools.push(toggleTool);
        this._addToggleToolHandler(toggleTool);
    },

    //get geometries
    //----------------------------------------------------------------------

    getGeometries() {
        return this._geometries;
    },

    _queryFeatures() {
        this._cancelQueryFeatures();

        if (this._hasActiveToggleTool()) {
            this._queryFeaturesTimer = ct_async(function () {
                this.queryFeatures();
            }, this, 100);
        }
    },

    _cancelQueryFeatures() {
        if (this._queryFeaturesTimer) {
            this._queryFeaturesTimer.cancel();
            this._queryFeaturesTimer = null;
        }
    },

    queryFeatures() {
        const geometries = this._geometries = [];
        const maxLength = this.maxLength;

        const extent = this._mapWidgetModel.extent;
        const graphicsLayers = this._getVisibleGraphicsLayers();
        graphicsLayers.forEach(graphicsLayer => {
            graphicsLayer.graphics.forEach((graphic) => {
                if ((!maxLength || geometries.length < maxLength) && (!graphic.context || !graphic.context.snapping) && extent.intersects(graphic.geometry)) {
                    geometries.push(this._getGeometry(graphic));
                }
            }, this);
        });
    },

    _getGeometry(feature) {
        let geometry = feature.geometry;//.clone();
        if (geometry.type === "polygon") {
            geometry = new Polyline({
                hasZ: geometry.hasZ,
                hasM: geometry.hasM,
                paths: geometry.rings,
                spatialReference: geometry.spatialReference
            });
        }
        geometry.object = feature;
        return geometry;
    },

    _hasActiveToggleTool() {
        const tools = this._toggleTools;
        return tools && tools.length && tools.some(tool => {
            return tool.get("active");
        });
    },

    _getVisibleGraphicsLayers() {
        return this._mapWidgetModel.map.allLayers.filter(layer => {
            return layer.visible && this._isGraphicsLayer(layer);
        });
    },

    _isGraphicsLayer(layer) {
        return layer.type === "graphics" && layer.declaredClass === "esri.layers.GraphicsLayer" && layer.listMode === "show" && !layer.url;//layer.id.indexOf("-layer-") === -1;
    },

    //events handlers
    //----------------------------------------------------------------------

    _addToggleToolHandler(toggleTool) {
        const that = this;
        this._ownHandler.add(toggleTool.watch("active", (name, oldValue, newValue) => {
            newValue ? that._queryFeatures() : that._geometries = [];
        }));
    },

    _addMapWidgetModelHandler() {
        const that = this;
        const mapWidgetModel = this._mapWidgetModel;

        this._addChangeLayersHandler({added: mapWidgetModel.map.layers});
        this._ownHandler.add(mapWidgetModel.map.allLayers.on("change", evt => {
            that._queryFeatures();
            that._addChangeLayersHandler(evt);
        }));
        this._ownHandler.add(mapWidgetModel.watch("extent", () => {
            that._queryFeatures();
        }));
    },

    _addChangeLayersHandler(evt) {
        evt.added && evt.added.forEach(layer => {
            this._addChangeLayerHandler(layer);
        }, this);
        evt.removed && evt.removed.forEach(layer => {
            this._removeChangeLayerHandler(layer);
        }, this);
    },

    _addChangeLayerHandler(layer) {
        if (layer && this._isGraphicsLayer(layer) && !layer._hasSetSnappingHandler) {
            layer._hasSetSnappingHandler = true;

            const id = layer.id;
            const that = this;
            const name = this._getChangeLayerHandlerName(id);

            that._addChangeGraphicHandler(layer.graphics);
            that._ownHandler.add(layer.watch("graphics", graphics => {
                that._addChangeGraphicHandler(graphics);
            }), name);
            that._ownHandler.add(layer.watch("visible", () => {
                that._queryFeatures();
            }), name);
        }
    },

    _addChangeGraphicHandler(graphics, layerId) {
        if (graphics) {
            const that = this;
            const name = this._getChangeGraphicHandlerName(layerId);

            this._ownHandler.remove(name);
            this._ownHandler.add(graphics.on("change", () => {
                that._queryFeatures();
            }), name);
        }
    },

    _removeChangeLayerHandler(layer) {
        if (layer && layer._hasSetSnappingHandler) {
            delete layer._hasSetSnappingHandler;

            const id = layer.id;
            this._ownHandler.remove(this._getChangeLayerHandlerName(id));
            this._ownHandler.remove(this._getChangeGraphicHandlerName(id));
        }
    },

    _getChangeLayerHandlerName(id) {
        return "watchLayer_" + id;
    },

    _getChangeGraphicHandlerName(id) {
        return "watchGraphics_" + id;
    },

    //Sketch handler
    handler(evt) {
        const type = evt.type;
        const state = evt.state;
        if (type === "update" && state === "complete") {
            this._queryFeatures();
        }
    }
});
