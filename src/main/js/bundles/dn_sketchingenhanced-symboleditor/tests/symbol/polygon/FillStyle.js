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
import FillStyle from '../../../components/symbol/polygon/FillStyle.vue';
import {describe, it} from 'intern!bdd';
import Vue from 'apprt-vue/Vue';

const _createComponent = () => new Vue(FillStyle);

describe(module.id, () => {

    it('should not throw error when created', () => {
        expect(_createComponent()).to.be.an('object');
    });

    it('should have unique IDs in svg patterns', () => {
        const comp1 = _createComponent();
        const comp2 = _createComponent();

        comp1.fillStyle = 'vertical';
        comp2.fillStyle = 'vertical';

        comp1.$mount();
        comp2.$mount();

        const pattern1 = comp1.$el.querySelector('pattern');
        const id1 = pattern1.attributes.id.value;

        const pattern2 = comp2.$el.querySelector('pattern');
        const id2 = pattern2.attributes.id.value;

        expect(id1).to.not.equal(id2);
    });
});
