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
import LabelEditor from '../components/label/LabelEditor.vue';

registerSuite({
    name: module.id,
    'Label Editor Vue Component': function () {
        expect(new Vue(LabelEditor)).to.be.an('object');
    },

    'ScaleInfo for empty globalScales array with given maxScale': function () {
        const vm = new Vue(LabelEditor);
        vm.settings = {
            minScale: '',
            maxScale: 1000,
        };
        vm.locale = 'de-DE';
        vm.i18n.visible_scale_between = '${p1} bis ${p2}';
        vm.globalScales = [];
        const test1 = (vm.settings.maxScale).toLocaleString(vm.locale);
        const test2 = Infinity.toLocaleString(vm.locale);
        expect(vm.scaleInfo).to.be.equal('1:' + test1 + ' bis 1:' + test2);
    },

    'ScaleInfo for empty globalScales array with given minScale': function () {
        const vm = new Vue(LabelEditor);
        vm.settings = {
            minScale: 100,
            maxScale: '',
        };
        vm.locale = 'de-DE';
        vm.i18n.visible_scale_between = '${p1} bis ${p2}';
        vm.globalScales = [];
        const test1 = (1).toLocaleString(vm.locale);
        const test2 = (vm.settings.minScale).toLocaleString(vm.locale);
        expect(vm.scaleInfo).to.be.equal('1:' + test1 + ' bis 1:' + test2);
    },

    'ScaleInfo for empty globalScales array with no given  min or max scale': function () {
        const vm = new Vue(LabelEditor);
        vm.settings = {
            minScale: '',
            maxScale: '',
        };
        vm.locale = 'de-DE';
        vm.i18n.visible_scale_between = '${p1} bis ${p2}';
        vm.globalScales = [];

        const test1 = (1).toLocaleString(vm.locale);
        const test2 = Infinity.toLocaleString(vm.locale);
        expect(vm.scaleInfo).to.be.equal('1:'+ test1 + ' bis 1:' + test2);
    },

    'ScaleInfo for given globalScales array with given minScale': function () {
        const vm = new Vue(LabelEditor);
        vm.settings = {
            minScale: 100,
            maxScale: '',
        };
        vm.locale = 'de-DE';
        vm.i18n.visible_scale_between = '${p1} bis ${p2}';
        vm.globalScales = [10, 200, 3000];
        const test1 = (10).toLocaleString(vm.locale);
        const test2 = (vm.settings.minScale).toLocaleString(vm.locale);
        expect(vm.scaleInfo).to.be.equal('1:' + test1 + ' bis 1:' + test2);
    },

    'ScaleInfo for given globalScales array with given maxScale': function () {
        const vm = new Vue(LabelEditor);
        vm.settings = {
            minScale: '',
            maxScale: 1000,
        };
        vm.locale = 'de-DE';
        vm.i18n.visible_scale_between = '${p1} bis ${p2}';
        vm.globalScales = [10, 200, 3000];
        const test1 = (vm.settings.maxScale).toLocaleString(vm.locale);
        const test2 = (3000).toLocaleString(vm.locale);
        expect(vm.scaleInfo).to.be.equal('1:' + test1 + ' bis 1:' + test2);
    },

    'ScaleInfo for given globalScales array with given min and max scale': function () {
        const vm = new Vue(LabelEditor);
        vm.settings = {
            minScale: 100,
            maxScale: 1000,
        };
        vm.locale = 'de-DE';
        vm.i18n.visible_scale_between = '${p1} bis ${p2}';
        vm.globalScales = [10, 200, 3000];
        const test1 = (vm.settings.minScale).toLocaleString(vm.locale);
        const test2 = (vm.settings.maxScale).toLocaleString(vm.locale);
        expect(vm.scaleInfo).to.be.equal('1:' + test1 + ' bis 1:' + test2);
    },

    'ScaleInfo for undefined globalScales array with given min scale': function () {
        const vm = new Vue(LabelEditor);
        vm.settings = {
            minScale: 100,
            maxScale: '',
        };
        vm.locale = 'de-DE';
        vm.i18n.visible_scale_between = '${p1} bis ${p2}';
        vm.globalScales = undefined;
        const test1 = (1).toLocaleString(vm.locale);
        const test2 = (vm.settings.minScale).toLocaleString(vm.locale);
        expect(vm.scaleInfo).to.be.equal('1:' + test1 + ' bis 1:' + test2);
    },
});
