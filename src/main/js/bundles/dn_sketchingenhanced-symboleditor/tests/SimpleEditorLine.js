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
import {expect} from "chai";
import module from 'module';
import Vue from 'apprt-vue/Vue';
import SimpleEditorLine from '../components/symbol/line/SimpleEditorLine.vue';

describe(module.id, function () {
    it("SimpleEditorPolygon Vue Component", function () {
        expect(new Vue(SimpleEditorLine)).to.be.an('object');
    });
    it("lineStyles is an array which length is equal 6", function () {
        const vm = new Vue(SimpleEditorLine);
        expect(vm.lineStyles).to.be.an('array');
        expect(vm.lineStyles.length).to.equal(6);
    });
    it("lineStyle is type string", function () {
        const vm = new Vue(SimpleEditorLine);
        expect(vm.lineStyle).to.be.an('string');
    });
    it("lineColorValue is a string and is equal to #262626 if lineColor is equal to #262626", function () {
        const vm = new Vue(SimpleEditorLine);
        vm.lineColor = '#262626';
        expect(vm.lineColorValue).to.be.an('string');
        expect(vm.lineColorValue).to.equal('#262626');
    });
    it("lineWeightValue is a string and is equal to 7 if lineWeight is equal to 7", function () {
        const vm = new Vue(SimpleEditorLine);
        vm.lineWeight = 7;
        expect(vm.lineWeightValue).to.be.an('number');
        expect(vm.lineWeightValue).to.equal(7);
    });
    it("selectedLineStyle is a string and is equal to long-dash-dot-dot if lineStyle is equal to long-dash-dot-dot", function () {
        const vm = new Vue(SimpleEditorLine);
        vm.lineStyle = 'long-dash-dot-dot';
        expect(vm.selectedLineStyle).to.be.an('string');
        expect(vm.selectedLineStyle).to.equal('long-dash-dot-dot');
    });
    it("lineStyle change after selected line style changes", function () {
        const vm = new Vue(SimpleEditorLine);
        vm.selectedLineStyle = 'dash';
        expect(vm.lineStyle).to.equal(vm.selectedLineStyle);
    });
    it("lineColor changes after selected lineColorValue changes", function () {
        const vm = new Vue(SimpleEditorLine);
        vm.lineColorValue = '#92D050';
        expect(vm.lineColor).to.equal(vm.lineColorValue);
    });
    it("lineWeight changes after selected lineWeightValue changes", function () {
        const vm = new Vue(SimpleEditorLine);
        vm.lineWeightValue = 1;
        expect(vm.lineWeight).to.equal(vm.lineWeightValue);
    });
});
