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
import registerSuite from 'intern!object';
import assert from 'intern/chai!assert';
import expect from 'intern/chai!expect';
import module from 'module';
import MeasurementController from '../MeasurementController';
import * as geoEngine from 'esri/geometry/geometryEngine';
import Polyline from 'esri/geometry/Polyline';
import Polygon from 'esri/geometry/Polygon';

const controller = new MeasurementController()
controller._properties = {
    unitAbbreviationMapping : {
        "meters": "m",
        "kilometers": "km",
        "square-meters": "m²",
        "square-kilometers": "km²",
        "hectares": "ha"
    }
};

registerSuite({
    name: module.id,
    'Measurement Controller': function () {
        assert.ok(controller);
    },
    'Calculate length for a short line': function () {
        controller.mDecimal = 1;
        controller.kmDecimal = 2;
        controller.geoEngine = geoEngine;
        controller._setLengthUnits("meter");
        const spatialReference = {
            wkid: 31466,
        };
        const path = [[0, 0], [0, 20]];
        const length = controller._getLength(new Polyline(path, spatialReference));
        expect(length).to.equal('20 m');
    },
    'Calculate length for a long line': function () {
        controller.mDecimal = 1;
        controller.kmDecimal = 2;
        controller.geoEngine = geoEngine;
        controller._setLengthUnits("kilometer");
        const spatialReference = {
            wkid: 31466,
        };
        const path = [[0, 0], [0, 2000]];
        const length = controller._getLength(new Polyline(path, spatialReference));
        expect(length).to.equal('2 km');
    },
    'Calculate area for a small polygon': function () {
        controller.mDecimal = 1;
        controller.kmDecimal = 2;
        controller.geoEngine = geoEngine;
        controller._setAreaUnits("quadratmeter");
        const spatialReference = {
            wkid: 31466,
        };
        const rings = [[0, 0], [0, 2], [1, 2], [1, 0]];
        const area = controller._getArea(new Polygon(rings, spatialReference));
        expect(area).to.equal('2 m²');
    },
    'Calculate area for a big polygon': function () {
        controller.mDecimal = 1;
        controller.kmDecimal = 2;
        controller.geoEngine = geoEngine;
        controller._setAreaUnits("quadratkilometer");
        const spatialReference = {
            wkid: 31466,
        };
        const rings = [[0, 0], [0, 2000], [2000, 2000], [2000, 0]];
        const area = controller._getArea(new Polygon(rings, spatialReference));
        expect(area).to.equal('4 km²');
    },
    'get text position': function () {
        let path = [[0, 0], [0, 20]];
        expect(controller._getTextPosition(path)).to.equal('center');
        path = [[0, 0], [0, -20]];
        expect(controller._getTextPosition(path)).to.equal('center');
        path = [[0, 0], [20, 0]];
        expect(controller._getTextPosition(path)).to.equal('left');
        path = [[0, 0], [-20, 0]];
        expect(controller._getTextPosition(path)).to.equal('right');
        path = [[0, 0], [-20, 20]];
        expect(controller._getTextPosition(path)).to.equal('right');
        path = [[0, 0], [20, 20]];
        expect(controller._getTextPosition(path)).to.equal('left');
    },
    'get text y offset': function () {
        let path = [[0, 0], [0, 20]];
        let offset = controller._getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(1);
        path = [[0, 0], [0, -20]];
        offset = controller._getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(-1);
        path = [[0, 0], [20, 0]];
        offset = controller._getYOffset(path);
        expect(offset).to.equal(0);
        path = [[0, 0], [-20, 0]];
        offset = controller._getYOffset(path);
        expect(offset).to.equal(0);
        path = [[0, 0], [-20, 20]];
        offset = controller._getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(1);
        path = [[0, 0], [20, 20]];
        offset = controller._getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(1);
        path = [[0, 0], [20, -20]];
        offset = controller._getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(-1);
    },
});
