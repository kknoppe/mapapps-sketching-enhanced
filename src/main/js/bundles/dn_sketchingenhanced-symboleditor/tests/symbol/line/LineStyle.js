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
import { expect } from "chai";
import module from 'module';
import LineStyle from '../../../components/symbol/line/LineStyle.vue';
import Vue from 'apprt-vue/Vue';

const _createComponent = () => new Vue(LineStyle);

describe(module.id, () => {

    it('should not throw error when created', () => {
        expect(_createComponent()).to.be.an('object');
    });

    it('should have no dasharray when style is "solid"', () => {
        const comp = _createComponent();
        comp.lineStyle = 'solid';
        comp.$mount();

        const pattern = comp.$el.querySelector('line');
        const style = pattern.getAttribute('style');

        expect(style).to.not.include('stroke-dasharray');
    });

    it('should have dasharray when style is "dot"', () => {
        const comp = _createComponent();
        comp.lineStyle = 'dot';
        comp.$mount();

        const pattern = comp.$el.querySelector('line');
        const style = pattern.getAttribute('style');

        expect(style).to.include('stroke-dasharray');
    });
});
