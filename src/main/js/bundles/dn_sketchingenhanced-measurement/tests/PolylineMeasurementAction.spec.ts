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
import module from "module";
import PolylineAction from '../actions/PolylineMeasurementAction';

const component = new PolylineAction(null, null, null, null);

// @ts-ignore
describe(module.id, function () {
    it("get text position", function () {
        let path = [[0, 0], [0, 20]];
        expect(component.getTextPosition(path)).to.equal('center');
        path = [[0, 0], [0, -20]];
        expect(component.getTextPosition(path)).to.equal('center');
        path = [[0, 0], [20, 0]];
        expect(component.getTextPosition(path)).to.equal('left');
        path = [[0, 0], [-20, 0]];
        expect(component.getTextPosition(path)).to.equal('right');
        path = [[0, 0], [-20, 20]];
        expect(component.getTextPosition(path)).to.equal('right');
        path = [[0, 0], [20, 20]];
        expect(component.getTextPosition(path)).to.equal('left');
    });

    it("get text y offset", function () {
        let path = [[0, 0], [0, 20]];
        let offset = component.getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(1);
        path = [[0, 0], [0, -20]];
        offset = component.getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(-1);
        path = [[0, 0], [20, 0]];
        offset = component.getYOffset(path);
        expect(offset).to.equal(0);
        path = [[0, 0], [-20, 0]];
        offset = component.getYOffset(path);
        expect(offset).to.equal(0);
        path = [[0, 0], [-20, 20]];
        offset = component.getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(1);
        path = [[0, 0], [20, 20]];
        offset = component.getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(1);
        path = [[0, 0], [20, -20]];
        offset = component.getYOffset(path);
        expect(offset / Math.abs(offset)).to.equal(-1);
    });
});
