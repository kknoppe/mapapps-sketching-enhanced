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
import LineSetting from './LineSetting';
import ColorSetting from './ColorSetting';

class PolygonSetting {

    /**
     *
     * @param {PolygonSetting} copy
     */
    constructor(copy) {
        /**
         *
         * @type {LineSetting}
         */
        this.outline = new LineSetting(copy && copy.outline);

        /**
         *
         * @type {ColorSetting}
         */
        this.color = copy && copy.color || new ColorSetting();

        /**
         *
         * @type {string}
         */
        this.style = copy && copy.style || 'solid';

        this.typeName = 'PolygonSetting';

        this.defaultLabel = copy && copy.defaultLabel || '';
    }

    toEsri() {
        return {type: 'simple-fill', color: this.color, style: this.style, outline: this.outline.toEsri()};
    }
}

export default PolygonSetting;
