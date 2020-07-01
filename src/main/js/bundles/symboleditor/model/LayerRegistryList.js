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
const items = Symbol('items');

/**
 * List for RegistryItems.
 * It overwrites existing items.
 */
class LayerRegistryList {

    /**
     * Initializes a new instance of the LayerRegistryList class
     */
    constructor() {
        /**
         * Items in list
         * @type {LayerRegistryItem[]}
         */
        this[items] = [];
    }

    /**
     * Adds an item to the list
     * @param {LayerRegistryItem} item
     */
    add(item) {
        const index = this._findIndex(item.settings);
        if (index >= 0) {
            // item is in list -> replace it
            this[items].splice(index, 1, item);
            return;
        }

        this[items].push(item);
    }

    /**
     * Returns the requested item
     * @param layerInfo
     * @return {null|LayerRegistryItem}
     */
    get(layerInfo) {
        const found = this._findIndex(layerInfo);
        if (found >= 0) {
            // return item
            return this[items][found];
        }

        // item was not found
        return null;
    }

    /**
     * Returns all items
     * @return {LayerRegistryItem[]}
     */
    getAll() {
        return this[items];
    }

    /**
     * Removes all items
     */
    clear() {
        this[items] = [];
    }

    remove(layerInfo) {
        const index = this._findIndex(layerInfo);
        if (index >= 0) {
            // item is in list -> remove it
            this[items].splice(index, 1);
        }
    }

    /**
     * Returns index of item in list
     * @param layerInfo
     * @return {number}
     * @private
     */
    _findIndex(layerInfo) {
        // find index of item
        return this[items].findIndex(x => x.settings.id === layerInfo.id && x.settings.source === layerInfo.source);
    }
}

export default LayerRegistryList;
