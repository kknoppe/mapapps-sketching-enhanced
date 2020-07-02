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
class ColorSetting {

    /**
     *
     * @param {ColorSetting} copy
     */
    constructor(copy) {
        /**
         *
         * @type {number}
         */
        this.r = copy ? copy.r : 0;

        /**
         *
         * @type {number}
         */
        this.g = copy ? copy.g : 0;

        /**
         *
         * @type {number}
         */
        this.b = copy ? copy.b : 0;

        /**
         *
         * @type {number}
         */
        this.a = copy ? copy.a : 1;
    }
}

export default ColorSetting;
