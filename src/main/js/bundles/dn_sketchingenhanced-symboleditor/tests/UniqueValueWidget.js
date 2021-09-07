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
import UniqueValueWidget from '../components/symbol/UniqueValueWidget.vue';

describe(module.id, function () {
    it("Unique Value Vue Component", function () {
        expect(new Vue(UniqueValueWidget)).to.be.an('object');
    });
    it("UniqueValue is type string", function () {
        const vm = new Vue(UniqueValueWidget);
        expect(vm.uniqueValue).to.be.an('string');
    });
    it("uniqueValueColor is type string", function () {
        const vm = new Vue(UniqueValueWidget);
        expect(vm.color).to.be.an('string');
    });
    it("Click on toggle button should return false if it is true after init", function () {
        const comp = new Vue(UniqueValueWidget);
        comp.isToggled = true;
        comp.$mount();
        const child = comp.$el.getElementsByClassName('uniqueValueBtn')[0];
        child.click();
        expect(comp.isToggled).to.equal(true);
    });
});
