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
import PointSetting from './model/PointSetting';
import LineSetting from './model/LineSetting';
import PolygonSetting from './model/PolygonSetting';
import SymbolCategory from './model/SymbolCategory';

class SymbolSettings {

    /**
     *
     * @param {SymbolSettings} copy
     */
    constructor(copy) {
        this.allowed = copy ? copy.allowed : false;
        this.enabled = copy && copy.enabled || false;

        /**
         *
         * @type {string}
         */
        this.type = copy && copy.type || 'single';

        /**
         *
         * @type {string}
         */
        this.geometryType = copy && copy.geometryType || 'point';

        this.warning = copy && copy.warning || false;

        /**
         * Categories of the Layer
         * @type {[SymbolCategory]}
         */
        this.categories = copy ? copy.categories.map(x => new SymbolCategory(x)) : [];

        /**
         * Default symbol of the layer
         * @type {PointSetting|LineSetting|PolygonSetting}
         */
        this.defaultSymbol = null;

        if (copy && copy.defaultSymbol && copy.defaultSymbol.typeName === 'PointSetting') {
            this.defaultSymbol = new PointSetting(copy.defaultSymbol);
        }
        if (copy && copy.defaultSymbol && copy.defaultSymbol.typeName === 'LineSetting') {
            this.defaultSymbol = new LineSetting(copy.defaultSymbol);
        }
        if (copy && copy.defaultSymbol && copy.defaultSymbol.typeName === 'PolygonSetting') {
            this.defaultSymbol = new PolygonSetting(copy.defaultSymbol);
        }

        this.fields = copy && copy.fields || [];

        this.fieldForSymbology = copy && copy.fieldForSymbology || '';

        this.defaultCategory = copy && copy.defaultCategory || '';
    }
}

export default SymbolSettings;
