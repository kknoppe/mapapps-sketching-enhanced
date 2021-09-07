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
import SizeSlider from '../components/input/SizeSlider.vue';

describe(module.id, function () {
    it("validateInput gives defined Minimum with NaN input", function () {
        const vm = new Vue(SizeSlider);
        vm.min = 2;
        expect(vm._validateInput('Test')).to.be.equal(2);
    });
    it("validateInput gives defined Minimum with input smaller than Minimum", function () {
        const vm = new Vue(SizeSlider);
        vm.min = 10;
        expect(vm._validateInput('5')).to.be.equal(10);
    });
    it("validateInput gives defined Maximum with input bigger than Maximum", function () {
        const vm = new Vue(SizeSlider);
        vm.max = 2;
        expect(vm._validateInput('5')).to.be.equal(2);
    });
    it("validateInput gives defined Minimum with empty input string", function () {
        const vm = new Vue(SizeSlider);
        vm.min = 2;
        expect(vm._validateInput('')).to.be.equal(2);
    });
    it("validateInput returns given value as Integer with input in expected range", function () {
        const vm = new Vue(SizeSlider);
        vm.min = 1;
        vm.max = 10;
        expect(vm._validateInput('5')).to.be.equal(5);
    });
});
