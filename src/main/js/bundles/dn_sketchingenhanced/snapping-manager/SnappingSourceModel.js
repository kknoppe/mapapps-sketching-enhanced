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
import Polyline from "esri/geometry/Polyline"
import Handles from "esri/core/Handles";
import {declare} from "apprt-core/Mutable";
import ct_async from "ct/async";
import QueryExecutions from "store-api/QueryExecutions";
import QueryExecution from "store-api/QueryExecution";

export default declare({
    //injected
    _toggleTools: [],
    _bindingSearchSources: null,
    _mapWidgetModel: null,

    //local
    stores: [],
    sources: [],
    _geometries: [],
    _ownHandler: new Handles(),

    _executions: null,
    _queryFeaturesTimer: null,
    _queryFeaturesPromise: null,

    activate() {
        this.i18n = this._i18n.get();
        this.maxLength = this._properties.maxLength || 0;

        //add handler
        this._ownHandler.add(this.watch("sources", () => {
            this._queryFeatures()
        }));
    },
    deactivate() {
        this._ownHandler.removeAll();
    },

    set_bindingSearchSources(bindingSearchSources) {
        this._bindingSearchSources = bindingSearchSources;
        ct_async(this._addBindSourcesHandler, this);
    },

    set_mapWidgetModel(mapWidgetModel) {
        this._mapWidgetModel = mapWidgetModel;
        ct_async(this._addMapWidgetModelHandler, this);
    },

    add_toggleTool(toggleTool) {
        this._toggleTools.push(toggleTool);
        this._addToggleToolHandler(toggleTool);
    },

    hasActiveToggleTool() {
        const tools = this._toggleTools;
        return tools && tools.length && tools.some(tool => {
            return tool.get("active");
        });
    },

    getGeometries() {
        return this._geometries;
    },

    _queryFeatures() {
        this._cancelQueryFeatures();

        if (this.hasActiveToggleTool()) {
            this._queryFeaturesTimer = ct_async(function () {
                this._queryFeaturesPromise = this.queryFeatures();
            }, this, 500);
        }
    },

    _cancelQueryFeatures() {
        if (this._queryFeaturesTimer) {
            this._queryFeaturesTimer.cancel();
            this._queryFeaturesTimer = null;
        }
        if (this._queryFeaturesPromise) {
            this._queryFeaturesPromise.cancel();
            this._queryFeaturesPromise = null;
        }
        if (this._executions) {
            this._executions.forEach(execution => {
                execution.cancel();
            });
            this._executions = null;
        }
    },

    queryFeatures(extent) {
        const geometries = this._geometries = [];
        const maxLength = this.maxLength;
        const reachedMaxCount = this.i18n.ui.reachedMaxCount;
        const queryExecutions = this._createQueryExecutions(this.sources, extent || this._mapWidgetModel.extent);
        const executions = this._executions = queryExecutions.executions;

        let warning = true;
        const logService = this._logService;
        executions.forEach(execution => {
            execution.waitForExecution().then(() => {
                if (!execution.error && warning) {
                    if (maxLength && maxLength < (geometries.length + execution.result.total)) {
                        warning = false;
                        logService.warn(reachedMaxCount.replace("%maxCount%", maxLength));
                    }
                    else {
                        execution.result.forEach((feature) => {
                            geometries.push(this._getGeometry(feature));
                        });
                    }
                }
            }, this);
        });
    },

    _createQueryExecutions(sources, extent) {
        const executions = sources.map(source => {
            const maxRecordCount = source.store.maxRecordCount;
            const count = this.maxLength || (maxRecordCount ? maxRecordCount + 1 : 1000);
            return new QueryExecution({
                source: source,
                parameters: [extent, {fields: {geometry: true}, count: count}]
            });
        });
        const queryExecutions = new QueryExecutions({executions: executions});
        queryExecutions.startParallel();
        return queryExecutions;
    },

    _getGeometry(feature) {
        let geometry = feature.geometry;
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

    _addToggleToolHandler(toggleTool) {
        const that = this;
        this._ownHandler.add(toggleTool.watch("active", (name, oldValue, newValue) => {
            newValue ? that._queryFeatures() : that._geometries = [];
        }));
    },

    _addMapWidgetModelHandler() {
        const that = this;
        this._ownHandler.add(this._mapWidgetModel.watch("extent", (extent) => {
            that._queryFeatures();
        }));
    },

    _addBindSourcesHandler() {
        this.stores = this._properties.stores || [];

        const bindHandler = this._bindingSearchSources.bindSources(this, this.stores, true, false);
        bindHandler.enable().syncToRightNow();

        this._ownHandler.add(bindHandler);
    }
});
