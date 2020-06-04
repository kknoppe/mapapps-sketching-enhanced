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

class LineSetting {

    /**
     *
     * @param {LineSetting} copy
     */
    constructor(copy) {
        /**
         *
         * @type {ColorSetting}
         */
        this.color = copy && copy.color || new ColorSetting();

        /**
         *
         * @type {number}
         */
        this.width = copy && copy.width || 1;

        /**
         *
         * @type {string}
         */
        this.style = copy && copy.style || 'solid';

        this.typeName = 'LineSetting';

        this.defaultLabel = copy && copy.defaultLabel || '';

    }

    toEsri() {
        return this;
    }
}

export default LineSetting;
