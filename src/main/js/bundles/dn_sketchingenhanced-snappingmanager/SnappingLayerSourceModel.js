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
import Handles from "esri/core/Handles";
import Polyline from "esri/geometry/Polyline";
import QueryTask from "esri/tasks/QueryTask";
import Query from "esri/tasks/support/Query";
import {declare} from "apprt-core/Mutable";
import ct_async from "ct/async";

export default declare({
    _geometries: [],
    _ownHandler: new Handles(),
    _queryFeaturesTimer: null,

    activate() {
        this._addToolHandler();
        this._addMapWidgetModelHandler();
    },

    deactivate() {
        this._ownHandler.removeAll();
    },

    getGeometries() {
        return this._geometries;
    },

    _queryFeatures() {
        this._cancelQueryFeatures();

        const timer = 100;
        if (this._toggleTool.active) {
            this._queryFeaturesTimer = ct_async(function () {
                this.queryFeatures();
            }, this, timer);
        }
    },

    _cancelQueryFeatures() {
        if (this._queryFeaturesTimer) {
            this._queryFeaturesTimer.cancel();
            this._queryFeaturesTimer = null;
        }
    },

    queryFeatures() {
        this._geometries = [];
        const extent = this._mapWidgetModel.extent;
        this._getVisibleQueryableLayers().then((layers) => {
            layers.forEach(layer => {
                if (layer.type === "graphics") {
                    layer.graphics.forEach((graphic) => {
                        this._geometries.push(this._getGeometry(graphic));
                    });
                } else if (layer.type === "feature" || layer.type === "geojson") {
                    const queryParams = layer.createQuery();
                    queryParams.geometry = extent;
                    queryParams.returnGeometry = true;
                    layer.queryFeatures(queryParams).then((result) => {
                        this._addQueryResults(result);
                    });
                } else if (layer.layer?.type === "map-image") {

                    const query = new Query();
                    query.geometry = extent;
                    query.returnGeometry = true;
                    const url = layer.url;

                    const queryTask = new QueryTask(url);
                    queryTask.execute(query).then((results) => {
                        this._addQueryResults(results);
                    });
                }
            });
        });
    },

    _addQueryResults(result) {
        if (result.exceededTransferLimit) {
            const toggleTimeout = 5000;
            clearTimeout(this.lastTimeout);
            this.lastTimeout = setTimeout(() => {
                this._logger.warn(this._i18n.get().ui.reachedMaxCount.replace("%{maxCount}",
                    result.features.length));
            }, toggleTimeout);
        }
        result.features.forEach((feature) => {
            // TODO: only show features that are inside of the current extent
            // (check if extent is fully inside of feature)
            if (!feature.context || !feature.context.snapping) {
                this._geometries.push(this._getGeometry(feature));
            }
        });
    },

    _getGeometry(feature, helperGeometry) {
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
        geometry.helperGeometry = helperGeometry;
        return geometry;
    },

    _getVisibleQueryableLayers() {
        const promises = [];
        const properties = this._properties;
        const allowBasemapSnapping = properties.allowBasemapSnapping;
        const layers = allowBasemapSnapping ? this._mapWidgetModel.map.allLayers : this._mapWidgetModel.map.layers;
        const flattenLayers = layers.flatten((item) => item.layers || item.sublayers);
        const snappingLayers = flattenLayers.filter((layer) => {
            if (layer.sketchingEnhanced && layer.sketchingEnhanced.allowSnapping !== undefined) {
                return layer.sketchingEnhanced.allowSnapping;
            } else if (this._layersToIgnore?.find(x => layer.id === x.layer.id)) {
                return false;
            } else if (layer.type === "graphics" || layer.type === "feature" || layer.type === "geojson"
                || (layer.layer?.type === "map-image" && !layer.sublayers)) {
                return true;
            } else if(!layer.sketchingEnhanced) {
                return properties.defaultAllowSnapping;
            } else {
                return false;
            }
        });
        snappingLayers.forEach((layer) => {
            const promise = new Promise((resolve) => {
                if (layer.loadStatus === "loaded") {
                    resolve(layer);
                } else if (layer.loadStatus === "failed") {
                    resolve(undefined);
                } else {
                    const loadedWatcher = layer.watch("loadStatus", (loadStatus) => {
                        if (loadStatus === "loaded") {
                            loadedWatcher.remove();
                            resolve(layer);
                        } else if (loadStatus === "failed") {
                            resolve(undefined);
                        }
                    });
                    layer.load();
                }
            });
            promises.push(promise);
        });
        return Promise.allSettled(promises).then((results) => {
            const loadedLayers = [];
            results.forEach((result) => {
                if (result.status === "fulfilled") {
                    loadedLayers.push(result.value);
                }
            });
            return loadedLayers.filter((layer) => this._isSnappable(layer));
        });
    },

    _isSnappable(layer) {
        if (!layer) {
            return false;
        }
        const layerVisible = this._isLayerVisible(layer);
        const layerQueryable = this._isLayerQueryable(layer);

        return layerVisible && (layerQueryable || layer.type === "graphics");
    },

    _isLayerVisible(layer) {
        if (layer.visible) {
            if (layer.parent) {
                return this._isLayerVisible(layer.parent);
            } else {
                return true;
            }
        } else if (!layer.parent) {
            return true;
        } else {
            return false;
        }
    },

    _isLayerQueryable(layer) {
        const parentLayer = layer.layer || layer;
        return parentLayer?.capabilities?.operations?.supportsQuery;
    },

    //events handlers
    //----------------------------------------------------------------------

    _addToolHandler() {
        this._ownHandler.add(this._toggleTool.watch("active", (name, oldValue, newValue) => {
            if (newValue) {
                this._queryFeatures();
            }
        }));
    },

    _addMapWidgetModelHandler() {
        const mapWidgetModel = this._mapWidgetModel;
        this._ownHandler.add(mapWidgetModel.map.layers.on("change", evt => {
            this._queryFeatures();
            this._addChangeLayersHandler(evt);
        }));
        this._ownHandler.add(mapWidgetModel.watch("extent", () => {
            this._queryFeatures();
        }));

        this._getVisibleQueryableLayers().then((layers) => {
            this._addChangeLayersHandler({added: layers});
        });
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
        if (layer && this._isSnappable(layer) && !layer._hasSetSnappingHandler) {
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
