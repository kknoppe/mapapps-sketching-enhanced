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
    mDecimal: 0
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
    it("Calculate length for a short line", function () {
        controller._model.mDecimal = 1;
        controller._model.kmDecimal = 2;
        controller.geoEngine = geoEngine;
        controller._model.lengthUnit = 'meters'
        const spatialReference = {
            wkid: 31466,
        };
        const path = [[0, 0], [0, 20]];
        const length = controller.getLength(new Polyline(path, spatialReference));
        expect(length).to.equal('20 m');
    });
    it("Calculate length for a long line", function () {
        controller._model.mDecimal = 1;
        controller._model.kmDecimal = 2;
        controller.geoEngine = geoEngine;
        controller._model.lengthUnit = 'kilometers'
        const spatialReference = {
            wkid: 31466,
        };
        const path = [[0, 0], [0, 2000]];
        const length = controller.getLength(new Polyline(path, spatialReference));
        expect(length).to.equal('2 km');
    });
    it("Calculate area for a small polygon", function () {
        controller._model.mDecimal = 1;
        controller._model.kmDecimal = 2;
        controller.geoEngine = geoEngine;
        controller._model.areaUnit = 'square-meters'
        const spatialReference = {
            wkid: 31466,
        };
        const rings = [[0, 0], [0, 2], [1, 2], [1, 0]];
        const area = controller.getArea(new Polygon(rings, spatialReference));
        expect(area).to.equal('2 m²');
    });
    it("Calculate area for a big polygon", function () {
        controller._model.mDecimal = 1;
        controller._model.kmDecimal = 2;
        controller.geoEngine = geoEngine;
        controller._model.areaUnit = 'square-kilometers';
        const spatialReference = {
            wkid: 31466,
        };
        const rings = [[0, 0], [0, 2000], [2000, 2000], [2000, 0]];
        const area = controller.getArea(new Polygon(rings, spatialReference));
        expect(area).to.equal('4 km²');
    });
    it("get text position", function () {
        let path = [[0, 0], [0, 20]];
        expect(controller.getTextPosition(path)).to.equal('center');
        path = [[0, 0], [0, -20]];
        expect(controller.getTextPosition(path)).to.equal('center');
        path = [[0, 0], [20, 0]];
        expect(controller.getTextPosition(path)).to.equal('left');
        path = [[0, 0], [-20, 0]];
        expect(controller.getTextPosition(path)).to.equal('right');
        path = [[0, 0], [-20, 20]];
        expect(controller.getTextPosition(path)).to.equal('right');
        path = [[0, 0], [20, 20]];
        expect(controller.getTextPosition(path)).to.equal('left');
    });
    it("get text y offset", function () {
        let path = [[0, 0], [0, 20]];
        let offset = controller.getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(1);
        path = [[0, 0], [0, -20]];
        offset = controller.getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(-1);
        path = [[0, 0], [20, 0]];
        offset = controller.getYOffset(path);
        expect(offset).to.equal(0);
        path = [[0, 0], [-20, 0]];
        offset = controller.getYOffset(path);
        expect(offset).to.equal(0);
        path = [[0, 0], [-20, 20]];
        offset = controller.getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(1);
        path = [[0, 0], [20, 20]];
        offset = controller.getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(1);
        path = [[0, 0], [20, -20]];
        offset = controller.getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(-1);
    });
});
