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
import expect from 'intern/chai!expect';
import module from 'module';
import EsriTransformer from '../../model/EsriTransformer';
import {describe, it} from 'intern!bdd';
import PointSetting from '../../model/PointSetting';
import PolygonSetting from '../../model/PolygonSetting';

const _createComponent = () => new EsriTransformer();

describe(module.id, () => {

    it('should not throw error when created', () => {
        expect(_createComponent()).to.be.an('object');
    });

    it('should have color property with cross as point symbol', () => {
        const comp = _createComponent();
        const expected = 'teal';
        const setting = new PointSetting({shape: 'cross', color: expected});

        const result = comp.transformToEsri(setting).toJSON();

        expect(result).to.have.property('color');
    });

    it('should have color property with X as point symbol', () => {
        const comp = _createComponent();
        const expected = 'teal';
        const setting = new PointSetting({shape: 'x', color: expected});

        const result = comp.transformToEsri(setting).toJSON();

        expect(result).to.have.property('color');
    });

    it('should set outline width to 0 when style is "none" (bug in esri API)', () => {
        const comp = _createComponent();
        const setting = new PolygonSetting({outline: {style: 'none'}});

        const result = comp.transformToEsri(setting);

        expect(result).to.have.property('outline');
        expect(result.outline).to.have.property('width');
        expect(result.outline.width).to.equal(0);
    });

    it('should not override outline width when style not "none"', () => {
        const comp = _createComponent();
        const expected = 42;

        const setting = new PolygonSetting({outline: {style: 'solid', width: expected}});
        const result = comp.transformToEsri(setting);

        expect(result).to.have.property('outline');
        expect(result.outline).to.have.property('width');
        expect(result.outline.width).to.equal(expected);
    });
});
