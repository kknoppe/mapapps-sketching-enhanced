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
import SimpleTextEditor from '../components/text/SimpleTextEditor.vue';

describe(module.id, function () {
    it("Simple Text Editor Component", function () {
        assert.ok(new Vue(SimpleTextEditor));
    });
    it("Check textStyle preview with no styling selected", function () {
        const vm = new Vue(SimpleTextEditor);
        vm.settings = {};
        vm.settings.textStyle = {bold: false, italic: false, underlined: false};

        expect(vm.textStyle).to.equal('');
    });
    it("Check textStyle preview with bold styling selected", function () {
        const vm = new Vue(SimpleTextEditor);
        vm.settings = {};
        vm.settings.textStyle = {bold: true, italic: false, underlined: false};

        expect(vm.textStyle).to.equal('B');
    });
    it("Check textStyle preview with italic styling selected", function () {
        const vm = new Vue(SimpleTextEditor);
        vm.settings = {};
        vm.settings.textStyle = {bold: false, italic: true, underlined: false};

        expect(vm.textStyle).to.equal('I');
    });
    it("Check textStyle preview with bold & italic styling selected", function () {
        const vm = new Vue(SimpleTextEditor);
        vm.settings = {};
        vm.settings.textStyle = {bold: true, italic: true, underlined: false};

        expect(vm.textStyle).to.equal('B, I');
    });
    it("Check font preview with Arial selected", function () {
        const vm = new Vue(SimpleTextEditor);
        vm.settings = {font: 'Arial'};

        expect(vm.font).to.equal('Arial');
    });
    it("Check font preview with Times New Roman selected", function () {
        const vm = new Vue(SimpleTextEditor);
        vm.settings = {font: 'Times New Roman'};

        expect(vm.font).to.equal('Times');
    });
    it("Check font preview with no font selected", function () {
        const vm = new Vue(SimpleTextEditor);
        vm.settings = {font: ''};

        expect(vm.font).to.equal('');
    });
});
