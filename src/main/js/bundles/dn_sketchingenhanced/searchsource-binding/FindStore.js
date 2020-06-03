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

function getStoreTarget(store) {
    return (store.target || store.layerId + "").replace("/FeatureServer/", "/MapServer/");
}

function findStoreByProp(stores, prop, propValue) {
    let store = null;
    stores.some(s => {
        s[prop] === propValue && (store = s);
        return !!store;
    });
    return store;
}

export default {
    allSearchStores: [],
    getStores(stores) {
        return stores || this.allSearchStores || [];
    },

    findStoreById(storeId, stores) {
        stores = this.getStores(stores);

        return findStoreByProp(stores, "id", storeId);
    },

    findStoreByLayerId(layerId, stores) {
        stores = this.getStores(stores);

        return findStoreByProp(stores, "layerId", layerId);
    },

    findStoreByTarget(target, stores) {
        stores = this.getStores(stores);

        let store = null;
        target = getStoreTarget({target: target});
        stores.some(s => {
            getStoreTarget(s) === target && (store = s);
            return !!store;
        });
        return store;
    },

    findStoreByTargetAndIds(target, storeIds, stores) {
        storeIds || (storeIds = []);
        stores = this.getStores(stores).filter(store => {
            return storeIds.indexOf(store.id) !== -1
        });

        return this.findStoreByTarget(target, stores);
    },

    findStore(store, stores) {
        stores = this.getStores(stores);

        let s = this.findStoreById(store.id, stores);
        !s && (s = this.findStoreByLayerId(store.layerId, stores));
        !s && (s = this.findStoreByTarget(store.target, stores));
        return s;
    }
}
