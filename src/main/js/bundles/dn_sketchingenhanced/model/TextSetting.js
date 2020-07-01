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
import ColorSetting from 'symboleditor/model/ColorSetting';

class TextSetting {

    /**
     *
     * @param {TextSetting} copy
     */
    constructor(copy) {

        this.angle = copy && copy.angle || 0;

        /**
         *
         * @type {string}
         */
        if(copy && typeof copy.font === 'string') {
            this.font = copy.font;
        } else {
            this.font = (copy && copy.font && copy.font.family) ? copy.font.family : 'Arial';
        }
        /**
         *
         * @type {ColorSetting}
         */
        if(copy && copy.textColor) {
            this.textColor = copy.textColor;
        } else {
            this.textColor = copy ? copy.color : new ColorSetting();
        }
        /**
         *
         * @type {string}
         */
        if(copy && copy.font) {
            this.textStyle = {
                bold: (copy.font.weight && copy.font.weight === 'bold'),
                italic: (copy.font.style && copy.font.style === 'italic'),
                underlined: (copy.font.decoration && copy.font.decoration === 'underline'),
            };
        } else {
            this.textStyle = {
                bold: false,
                italic: false,
                underlined: false,
            };
        }
        /**
         *
         * @type {number}
         */
        if(copy && copy.textSize) {
            this.textSize = copy.textSize;
        } else {
            this.textSize = (copy && copy.font && copy.font.size) ? copy.font.size : 12;
        }
        /**
         *
         * @type {ColorSetting}
         */
        if(copy && copy.textBlurColor) {
            this.textBlurColor = copy.textBlurColor;
        } else {
            this.textBlurColor = copy && copy.haloColor || new ColorSetting();
        }

        /**
         *
         * @type {Number}
         */
        if(copy && copy.textBlurRadius) {
            this.textBlurRadius = copy.textBlurRadius;
        } else {
            this.textBlurRadius = copy && copy.haloSize || 0;
        }

        this.typeName = 'TextSetting';
        // default label added, so that this can be shown in symbol editor and legend (if existing)
        this.defaultLabel = copy && copy.defaultLabel || '';
    }

    toEsri() {
        return {color: this.textColor, style: this.textStyle, size: this.textSize};
    }
}

export default TextSetting;
