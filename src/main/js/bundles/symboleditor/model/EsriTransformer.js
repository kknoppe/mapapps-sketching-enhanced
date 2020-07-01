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
import SimpleMarkerSymbol from 'esri/symbols/SimpleMarkerSymbol';

class EsriTransformer {

    transformToEsri(geometrySetting) {
        if (geometrySetting.typeName === 'PointSetting') {
            const symbol = new SimpleMarkerSymbol();
            symbol.color = geometrySetting.color;
            symbol.style = geometrySetting.shape;
            symbol.size = geometrySetting.radius;
            symbol.outline = geometrySetting.outline;

            symbol.toJSON = function () {
                const dummy = new SimpleMarkerSymbol({style: this.style, size: this.size, outline: this.outline});
                const newObj = dummy.toJSON();
                // applying "toJSON" on the styles "cross" and "x" deletes the color.
                // But it has to be set
                newObj.color = this.color;

                return newObj;
            };

            return symbol;

        } else if (geometrySetting.typeName === 'LineSetting') {
            return {
                type: 'simple-line',
                width: geometrySetting.style === 'none' ? 0 : geometrySetting.width,
                color: geometrySetting.color,
                style: geometrySetting.style,
            };
        } else if (geometrySetting.typeName === 'PolygonSetting') {
            return {
                type: 'simple-fill',
                color: geometrySetting.color,
                style: geometrySetting.style,
                outline: this.transformToEsri(geometrySetting.outline),
            };
        } else {
            return geometrySetting;
        }
    }
}

export default EsriTransformer;
