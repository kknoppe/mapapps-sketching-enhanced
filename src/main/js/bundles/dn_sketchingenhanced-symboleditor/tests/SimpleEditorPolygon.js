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
import SimpleEditorPolygon from '../components/symbol/polygon/SimpleEditorPolygon.vue';

describe(module.id, function () {
    it("fillStyles is an array which length is 8", function () {
        const vm = new Vue(SimpleEditorPolygon);
        expect(vm.fillStyles).to.be.an('array');
        expect(vm.fillStyles.length).to.equal(8);
    });
    it("lineStyles is an array which legth is equal 6", function () {
        const vm = new Vue(SimpleEditorPolygon);
        expect(vm.lineStyles).to.be.an('array');
        expect(vm.lineStyles.length).to.equal(6);
    });
    it("lineStyle is type string", function () {
        const vm = new Vue(SimpleEditorPolygon);
        expect(vm.lineStyle).to.be.an('string');
    });
    it("fillStyle is type string", function () {
        const vm = new Vue(SimpleEditorPolygon);
        expect(vm.fillStyle).to.be.an('string');
    });
    it("selectedFillStyleIndex is type string", function () {
        const vm = new Vue(SimpleEditorPolygon);
        expect(vm.selectedFillStyleIndex).to.be.an('number');
    });
    it("colorValue is a string and is equal to #262626 if color is equal to #262626", function () {
        const vm = new Vue(SimpleEditorPolygon);
        vm.color = '#262626';
        expect(vm.colorValue).to.be.an('string');
        expect(vm.colorValue).to.equal('#262626');
    });
});
