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
import module from 'module';
import { expect } from 'chai';
import DrawFurtherGeometries from '../DrawFurtherGeometries';

let comp;

describe(module.id, () => {
    beforeEach(function () {
        comp = new DrawFurtherGeometries();
    });

    afterEach(function () {
        comp.deactivate?.();
        comp = null;
    });

    it('should not throw error when created', () => {
        expect(comp).to.be.an('object');
    });

    describe('Triangle', () => {
        it('draw line from top left to bottom right', function () {
            const draw = [[10, 10], [20, 0]];
            const expected = [[20, 0], [0, 0], [10, 20], [20, 0]];
            const actual = comp._createTriangleRing(draw);
            expect(actual).to.deep.equal(expected);
        });

        it('draw line from top right to bottom left', function () {
            const draw = [[20, 20], [10, 10]];
            const expected = [[10, 10], [20, 30], [30, 10], [10, 10]];
            const actual = comp._createTriangleRing(draw);
            expect(actual).to.deep.equal(expected);
        });
    });
});
