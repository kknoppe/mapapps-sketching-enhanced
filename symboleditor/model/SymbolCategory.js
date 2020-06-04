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
import PointSetting from './PointSetting';
import LineSetting from './LineSetting';
import PolygonSetting from './PolygonSetting';

class SymbolCategory {
    constructor(value, label, symbol) {
        this.typeName = 'SymbolCategory';

        if (value instanceof SymbolCategory || (value && value.typeName === 'SymbolCategory')) {
            const copy = value;
            this.value = copy.value || null;
            this.label = copy.label || '';

            if (copy && copy.symbol && copy.symbol.typeName === 'PointSetting') {
                this.symbol = new PointSetting(copy.symbol);
            }
            if (copy && copy.symbol && copy.symbol.typeName === 'LineSetting') {
                this.symbol = new LineSetting(copy.symbol);
            }
            if (copy && copy.symbol && copy.symbol.typeName === 'PolygonSetting') {
                this.symbol = new PolygonSetting(copy.symbol);
            }
        } else {
            this.value = value || null;
            this.label = label || '';

            /**
             *
             * @type {PointSetting|LineSetting|PolygonSetting}
             */
            this.symbol = symbol || null;
        }
    }
}

export default SymbolCategory;
