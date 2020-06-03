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
import Handles from "esri/core/Handles";
import Binding from "apprt-binding/Binding";
import {declare} from "apprt-core/Mutable";
import ct_equal from "ct/_equal";
import FindStore from "./FindStore";
import FindMapLayer from "./FindMapLayer";

function isGraphicsLayer(layer) {
    return layer.type === "graphics" && layer.declaredClass === "esri.layers.GraphicsLayer";
}

function bindSources(searchSourceModel, targetModel) {
    const binding = Binding.create()
        .syncToRight("effectiveSources", "sources", effectiveSources => {
            const sources = effectiveSources.slice().sort((s1, s2) => {
                return s1.id > s2.id;
            });
            return ct_equal(targetModel.sources, sources) ? targetModel.sources : sources;
        });
    binding.bindTo(searchSourceModel, targetModel).enable().syncToRightNow();
    return binding;
}

function bindSearchStores(searchSourceModel, targetModel) {
    const binding = Binding.create()
        .syncToRight("allSources", "allSearchStores", allSources => {
            return allSources.map(source => {
                return source.store;
            });
        });
    binding.bindTo(searchSourceModel, targetModel).enable().syncToRightNow();
    return binding;
}

function addSources(sources, mapWidgetModel, storeIds = null, supportsGeometry = true, withGraphicsLayer = false) {
    const ss = [];
    sources.forEach(source => {
        const store = source.store;
        let add = !storeIds || !storeIds.length || storeIds.indexOf(store.id) !== -1;
        if (add && withGraphicsLayer) {
            const layer = FindMapLayer.findLayer(store, mapWidgetModel);
            add = !layer || !isGraphicsLayer(layer);
        }
        if (add && supportsGeometry) {
            const metaData = store.getMetadata();
            add = metaData.supportsGeometry !== false;
        }
        if (add) {
            add = !FindStore.findStoreByTarget(store.target, ss.map(s => {
                return s.store
            }));
        }

        add && ss.push(source);
    });

    return ss;
}

export default declare({
    //injected
    _mapWidgetModel: null,
    _searchSourceModel: null,

    //local
    sources: [],
    allSearchStores: [],
    _ownHandler: new Handles(),

    activate() {
        FindStore.allSearchStores = this.allSearchStores;
        this._ownHandler.add(this.watch("allSearchStores", () => {
            FindStore.allSearchStores = this.allSearchStores;
        }));
    },

    deactivate() {
        this._ownHandler.removeAll();
    },

    set_searchSourceModel(searchSourceModel) {
        this._searchSourceModel = searchSourceModel;
        //add handler
        this._ownHandler.add(bindSources(searchSourceModel, this));
        this._ownHandler.add(bindSearchStores(searchSourceModel, this));
    },

    bindSources(targetModel, storeIds, supportsGeometry, withGraphicsLayer) {
        const mapWidgetModel = this._mapWidgetModel;
        const binding = Binding.create().syncToRight("sources", "sources", sources => {
                const ss = addSources(sources, mapWidgetModel, storeIds, supportsGeometry, withGraphicsLayer);
                return ct_equal(targetModel.sources, ss) ? targetModel.sources : ss;
            }
        );
        binding.bindTo(this, targetModel);
        return binding;
    },

    bindSourcesToFeatureEditItems(targetModel, storeIds, supportsGeometry, withGraphicsLayer) {
        const mapWidgetModel = this._mapWidgetModel;
        const binding = Binding.create().syncToRight("sources", "items", sources => {
                const items = [];
                const ss = addSources(sources, mapWidgetModel, storeIds, supportsGeometry, withGraphicsLayer);
                ss.forEach(({id, title, store}) => {
                    const metaData = store.getMetadata();
                    (metaData.canModifyLayer || metaData.allowGeometryUpdates) && items.push({id: id, title: title, storeId: store.id, geometryType: metaData.geometryType});
                });
                return items;
            }
        );
        binding.bindTo(this, targetModel);
        return binding;
    }
});
