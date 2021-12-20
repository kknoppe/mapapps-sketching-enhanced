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
import {assert, expect} from "chai";
import module from "module";
import MeasurementController from '../MeasurementController';
import * as geoEngine from 'esri/geometry/geometryEngine';
import Polyline from 'esri/geometry/Polyline';
import Polygon from 'esri/geometry/Polygon';

const controller = new MeasurementController()

controller.i18n = {
    locale: 'de-de'
}
controller._model = {
    spatialReference: {
        isWebMercator: false
    },
    mDecimal: 0,
    watch: () => { remove: () => null },
}
controller._mapWidgetModel = {
    spatialReference: {
        isWebMercator: false
    }
}

controller.activate();
controller.setProperties({
    unitAbbreviationMapping: {
        "meters": "m",
        "kilometers": "km",
        "square-meters": "m²",
        "square-kilometers": "km²",
        "hectares": "ha"
    }
});

describe(module.id, function () {
    it("Measurement Controller", function () {
        assert.ok(controller);
    });
});
