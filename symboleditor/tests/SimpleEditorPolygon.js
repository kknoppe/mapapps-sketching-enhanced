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
import SimpleSymbolEditor from '../components/symbol/polygon/SimpleEditorPolygon.vue';

registerSuite({
    name: module.id,
    'SimpleEditorPolygon Vue Component': function () {
        expect(new Vue(SimpleSymbolEditor)).to.be.an('object');
    },
    'fillStyles is an array which length is 8': function () {
        const vm = new Vue(SimpleSymbolEditor);
        expect(vm.fillStyles).to.be.an('array');
        expect(vm.fillStyles.length).to.equal(8);
    },
    'lineStyles is an array which legth is equal 6': function () {
        const vm = new Vue(SimpleSymbolEditor);
        expect(vm.lineStyles).to.be.an('array');
        expect(vm.lineStyles.length).to.equal(6);
    },
    'lineStyle is type string': function () {
        const vm = new Vue(SimpleSymbolEditor);
        expect(vm.lineStyle).to.be.an('string');
    },
    'fillStyle is type string': function () {
        const vm = new Vue(SimpleSymbolEditor);
        expect(vm.fillStyle).to.be.an('string');
    },
    'selectedFillStyleIndex is type string': function () {
        const vm = new Vue(SimpleSymbolEditor);
        expect(vm.selectedFillStyleIndex).to.be.an('number');
    },
    'colorValue is a string and is equal to #262626 if color is equal to #262626': function () {
        const vm = new Vue(SimpleSymbolEditor);
        vm.color = '#262626';
        expect(vm.colorValue).to.be.an('string');
        expect(vm.colorValue).to.equal('#262626');
    },
});
