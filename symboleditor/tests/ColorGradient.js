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
import expect from 'intern/chai!expect';
import module from 'module';
import Vue from 'apprt-vue/Vue';
import ColorGradient from '../components/symbol/ColorGradient.vue';

registerSuite({
    name: module.id,
    'Color Gradient Vue Component': function () {
        expect(new Vue(ColorGradient)).to.be.an('object');
    },

    'colorPathList is an array and it has 2 items': function () {
        const vm = new Vue(ColorGradient);
        expect(vm.colorPathList).to.an('array');
        expect(vm.colorPathList.length).to.deep.equal(2);
    },

    'selectedColorPath is equal to 0': function () {
        const vm = new Vue(ColorGradient);
        expect(vm.selectedColorGradient).to.deep.equal(0);
    },
});
