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
import ColorSetting from './ColorSetting';
import LineSetting from './LineSetting';

class PointSetting {

    /**
     *
     * @param {PointSetting} copy
     * @param {number} maxSymbolSize
     */
    constructor(copy, maxSymbolSize) {
        /**
         *
         * @type {ColorSetting}
         */
        this.color = copy ? copy.color : new ColorSetting();

        /**
         *
         * @type {string}
         */
        this.shape = copy && copy.shape || 'circle';

        /**
         *
         * @type {number}
         */
        this.radius = copy && copy.radius || 6;

        this.url = copy ? copy.url : '';

        this.outline = new LineSetting(copy && copy.outline);

        this.typeName = 'PointSetting';
        // default label added, so that this can be shown in symbol editor and legend (if existing)
        this.defaultLabel = copy && copy.defaultLabel || '';

        // maximum size of a point symbol
        this.maxPointSize = copy?.maxPointSize || maxSymbolSize || 100;
    }

    toEsri() {
        return {color: this.color, style: this.shape, size: this.radius};
    }
}

export default PointSetting;
