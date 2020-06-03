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
import SimpleEditorPoint from '../components/symbol/point/SimpleEditorPoint.vue';

registerSuite({
    name: module.id,
    'SimpleEditorPoint Vue Component': function () {
        expect(new Vue(SimpleEditorPoint)).to.be.an('object');
    },
    'pointStyles is an array which length is equal 6': function () {
        const vm = new Vue(SimpleEditorPoint);
        expect(vm.pointStyles).to.be.an('array');
        expect(vm.pointStyles.length).to.equal(4);
    },
    'pointSymbol is type string': function () {
        const vm = new Vue(SimpleEditorPoint);
        expect(vm.pointSymbol).to.be.an('string');
    },
    'pointColorValue is a string and is equal to #262626 if pointColor is equal to #262626': function () {
        const vm = new Vue(SimpleEditorPoint);
        vm.pointColor = '#262626';
        expect(vm.pointColorValue).to.be.an('string');
        expect(vm.pointColorValue).to.equal(vm.pointColor);
    },
    'pointRadiusValue is a string and is equal to 7 if pointRadius is equal to 7': function () {
        const vm = new Vue(SimpleEditorPoint);
        vm.pointRadius = 7;
        expect(vm.pointRadiusValue).to.be.an('number');
        expect(vm.pointRadiusValue).to.equal(vm.pointRadius);
    },
    'selectedPointSymbol is a string and is equal to pointSymbol': function () {
        const vm = new Vue(SimpleEditorPoint);
        vm.pointSymbol = 'cross';
        expect(vm.selectedPointSymbol).to.be.an('string');
        expect(vm.selectedPointSymbol).to.equal(vm.pointSymbol);
    },
    'pointSymbol changes after selected point style changes': function () {
        const vm = new Vue(SimpleEditorPoint);
        vm.selectedPointSymbol = 'circle';
        expect(vm.pointSymbol).to.equal(vm.selectedPointSymbol);
    },
    'pointColor changes after selected pointColorValue changes': function () {
        const vm = new Vue(SimpleEditorPoint);
        vm.pointColorValue = '#92D050';
        expect(vm.pointColor).to.equal(vm.pointColorValue);
    },
    'pointRadius changes after selected pointRadiusValue changes': function () {
        const vm = new Vue(SimpleEditorPoint);
        vm.pointRadiusValue = 1;
        expect(vm.pointRadius).to.equal(vm.pointRadiusValue);
    },
});
