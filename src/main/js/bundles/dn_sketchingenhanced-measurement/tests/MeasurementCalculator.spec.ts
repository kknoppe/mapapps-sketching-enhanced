///
/// Copyright (C) 2020 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import { assert, expect } from "chai";
import module from "module";
import { MeasurementCalculator } from '../MeasurementCalculator';
import Polyline from 'esri/geometry/Polyline';
import Polygon from 'esri/geometry/Polygon';
import SpatialReference from "esri/geometry/SpatialReference";

const component = new MeasurementCalculator(
    {
        mDecimal: 1,
        kmDecimal: 1,
        unitAbbreviationMapping: {
            "meters": "m",
            "kilometers": "km",
            "square-meters": "m²",
            "square-kilometers": "km²",
            "hectares": "ha"
        },
        areaUnit: 'auto',
        lengthUnit: 'auto',
        srsDefinition: {
            geodesic: [4326, 102113, 102100, 3857],
        },
        pointCoordUnitSymbolX: null,
        pointCoordUnitSymbolY: null,
    },
    null,
    { locale: 'de-de' }
);

// @ts-ignore
describe(module.id, function () {
    it("Measurement Calculator", function () {
        assert.ok(component);
    });
    it("Calculate length for a short line", function () {
        component.settings.mDecimal = 1;
        component.settings.kmDecimal = 2;
        component.settings.lengthUnit = 'meters'
        const spatialReference = new SpatialReference({ wkid: 31466 });
        const paths = [[[0, 0], [0, 20]]];
        const length = component.getLength(new Polyline({ paths, spatialReference }));
        expect(length).to.equal('20 m');
    });

    it("Calculate length for a long line", function () {
        component.settings.mDecimal = 1;
        component.settings.kmDecimal = 2;
        component.settings.lengthUnit = 'kilometers'
        const spatialReference = new SpatialReference({ wkid: 31466 });
        const paths = [[[0, 0], [0, 2000]]];
        const length = component.getLength(new Polyline({ paths, spatialReference }));
        expect(length).to.equal('2 km');
    });
    it("Calculate area for a small polygon", function () {
        component.settings.mDecimal = 1;
        component.settings.kmDecimal = 2;
        component.settings.areaUnit = 'square-meters'
        const spatialReference = new SpatialReference({ wkid: 31466 });
        const rings = [[[0, 0], [0, 2], [1, 2], [1, 0]]];
        const area = component.getArea(new Polygon({ rings, spatialReference }));
        expect(area).to.equal('2 m²');
    });
    it("Calculate area for a big polygon", function () {
        component.settings.mDecimal = 1;
        component.settings.kmDecimal = 2;
        component.settings.areaUnit = 'square-kilometers';
        const spatialReference = new SpatialReference({ wkid: 31466 });
        const rings = [[[0, 0], [0, 2000], [2000, 2000], [2000, 0]]];
        const area = component.getArea(new Polygon({ rings, spatialReference }));
        expect(area).to.equal('4 km²');
    });

    it("Calculate geodesic length", function () {
        component.settings.mDecimal = 1;
        component.settings.kmDecimal = 2;
        component.settings.lengthUnit = 'kilometers';
        const spatialReference = new SpatialReference({ wkid: 3857 });
        const rings = [[[0, 0], [0, 2000], [2000, 2000], [2000, 0]]];
        const area = component.getArea(new Polygon({ rings, spatialReference }));
        expect(area).to.equal('3,97 km²');
    });
});
