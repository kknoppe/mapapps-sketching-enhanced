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
import {assert, expect} from "chai";
import module from "module";
import Vue from 'apprt-vue/Vue';
import ConstructionCheckbox from '../components/construction/ConstructionCheckbox.vue';

describe(module.id, function () {
    it("Simple Text Editor Component", function () {
        assert.ok(new Vue(ConstructionCheckbox));
    });
    it("Validate number as a string input of Checkbox", function () {
        const vm = new Vue(ConstructionCheckbox);
        vm.constructionModel = {planarLength: 20};
        vm.setting = 'planarLength';
        expect(vm._validateInput('10')).to.equal(10);
    });
    it("Validate number input of Checkbox", function () {
        const vm = new Vue(ConstructionCheckbox);
        vm.constructionModel = {planarLength: 20};
        vm.setting = 'planarLength';
        expect(vm._validateInput(10)).to.equal(10);
    });
    it("Validate string with no number input of Checkbox", function () {
        const vm = new Vue(ConstructionCheckbox);
        vm.constructionModel = {planarLength: 20};
        vm.setting = 'planarLength';
        expect(vm._validateInput('test')).to.equal(20);
    });
    it("Check suffix for planarLength", function () {
        const vm = new Vue(ConstructionCheckbox);
        vm.setting = 'planarLength';
        expect(vm.suffix).to.equal('m');
    });
    it("Check suffix for angleModulus", function () {
        const vm = new Vue(ConstructionCheckbox);
        vm.setting = 'angleModulus';
        expect(vm.suffix).to.equal('°');
    });
    it("Check getter of currentProperty property", function () {
        const vm = new Vue(ConstructionCheckbox);
        vm.key = 1;
        vm.constructionModel = {planarLength: 20};
        vm.setting = 'planarLength';

        expect(vm.currentProperty).to.equal(20);
    });
    it("Check setter of currentProperty property", function () {
        const vm = new Vue(ConstructionCheckbox);
        vm.key = 1;
        vm.constructionModel = {planarLength: 20};
        vm.constructionModel.set = (id, val) => {
            vm.constructionModel[id] = val;
        };
        vm.setting = 'planarLength';

        vm.currentProperty++;

        expect(vm.constructionModel.planarLength).to.equal(21);
    });
    it("Check getter of active property", function () {
        const vm = new Vue(ConstructionCheckbox);
        vm.key = 1;
        vm.constructionModel = {use: {planarLength: true}};
        vm.setting = 'planarLength';

        expect(vm.active).to.equal(true);
    });
    it("Check setter of active property", function () {
        const vm = new Vue(ConstructionCheckbox);
        vm.key = 1;
        vm.constructionModel = {use: {planarLength: false}};
        vm.constructionModel.set = (id, val) => {
            vm.constructionModel[id] = val;
        };
        vm.setting = 'planarLength';

        vm.active = true;

        expect(vm.constructionModel.use.planarLength).to.equal(true);
    });
    it("Check increment & decrement", function () {
        const vm = new Vue(ConstructionCheckbox);
        vm.key = 1;
        vm.constructionModel = {};
        vm.constructionModel.set = (id, val) => {
            vm.constructionModel[id] = val;
        };
        vm.currentProperty = 10;
        vm.increment();
        expect(vm.key).to.equal(2);
        expect(vm.currentProperty).to.equal(11);
        vm.decrement();
        vm.decrement();
        expect(vm.currentProperty).to.equal(9);
        expect(vm.key).to.equal(4);
    });
});
