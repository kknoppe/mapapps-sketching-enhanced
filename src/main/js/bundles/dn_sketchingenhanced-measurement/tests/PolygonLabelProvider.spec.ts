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

import { expect } from "chai";
import { MeasurementLabelProvider } from "dn_sketchingenhanced-measurement/labels/MeasurementLabelProvider";
import module from "module";
import sinon from "sinon";
import { PolygonLabelProvider } from '../labels/PolygonLabelProvider';

function createComponent(showCircumference = true): PolygonLabelProvider {
    const labelProvider = new MeasurementLabelProvider(null, null);
    sinon.stub(labelProvider, "getLabel").returnsArg(0);

    return new PolygonLabelProvider(labelProvider, showCircumference);
}

// @ts-ignore
describe(module.id, function () {
    it("should return area and circumference", function () {
        const [area, circumference] = ["5", "10"];
        const component = createComponent();
        const actual = component.getLabel(area, circumference);

        expect(actual.includes(area)).to.equal(true);
        expect(actual.includes(circumference)).to.equal(true);
    });

    it("should return values seperated by line break", function () {
        const [area, circumference] = ["2", "8"];
        const component = createComponent();
        const actual = component.getLabel(area, circumference);

        expect(actual.split("\n")).to.have.lengthOf(2);
    });

    it("should not return circumference by configuration", function () {
        const [area, circumference] = ["1", "3"];
        const component = createComponent(false);
        const actual = component.getLabel(area, circumference);

        expect(actual.split("\n")).to.have.lengthOf(1);
        expect(actual.includes(area)).to.equal(true);
    });
});
