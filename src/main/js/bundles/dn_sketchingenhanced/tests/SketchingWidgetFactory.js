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
import assert from 'intern/chai!assert';
import expect from 'intern/chai!expect';
import module from 'module';
import Vue from 'apprt-vue/Vue';
import SketchingWidget from '../components/SketchingWidget.vue';

registerSuite({
    name: module.id,
    'Sketching Widget Component': function () {
        assert.ok(new Vue(SketchingWidget));
    },

    'find tool by id': function () {
        const vm = new Vue(SketchingWidget);
        vm.tools = [
            {id: 'test1', a: 'b'},
            {id: 'test2', c: 'd'},
        ];
        expect(vm._getTool('test2')).to.equal(vm.tools[1]);
    },

    'activate construction panel': function () {
        const vm = new Vue(SketchingWidget);
        vm.constructionTool = null;
        const tool = {
            mode: 'construction',
            items: ['polylinetool'],
            active: false,
        };

        vm.constructionModel = {
            set: () => {
            },
        };

        vm._toggleConstruction(tool);
        expect(vm.constructionOn).to.equal(true);
        expect(vm.constructionTool).to.equal('polylinetool');
    },

    'deactivate construction panel': function () {
        const vm = new Vue(SketchingWidget);
        vm.constructionTool = 'polylinetool';
        vm.constructionOn = true;
        const tool = {
            mode: '',
            active: false,
        };

        vm.constructionModel = {
            set: () => {
                console.log('TEST');
            },
        };
        vm._toggleConstruction(tool);
        expect(vm.constructionOn).to.equal(false);
        expect(vm.constructionTool).to.equal(null);
    },

    'search tools to find group tool': function () {
        const vm = new Vue(SketchingWidget);
        vm.tools = [
            {id: 'test1', menu: false},
            {id: 'test2', menu: true, items: ['a', 'b']},
        ];
        const tool = {
            id: 'a',
        };
        expect(vm._searchToolsForToggle(tool)).to.equal('test2');
    },

    'set toolbar toggle for single button': function () {
        const vm = new Vue(SketchingWidget);
        vm.toggle = null;

        vm.firstToolGroupIds = [
            'drawpointtool',
            'sketchinglinegroup',
            'sketchingpolygongroup',
            'drawtexttool',
        ];
        vm.lastToolGroupIds = [
            'sketchinglayeradd',
            'sketchingtoolbox',
        ];
        vm.footerToolIds = [
            'drawundotool',
            'drawredotool',
            'drawcanceltool',
        ];

        const tool = {
            id: 'drawtexttool',
            active: false,
        };

        vm._setToggle(tool);

        expect(vm.toggle).to.equal('drawtexttool');
    },
    'set toolbar toggle for menu button': function () {
        const vm = new Vue(SketchingWidget);
        vm.toggle = null;

        vm.firstToolGroupIds = [
            'drawpointtool',
            'sketchinglinegroup',
            'sketchingpolygongroup',
            'drawtexttool',
        ];
        vm.lastToolGroupIds = [
            'sketchinglayeradd',
            'sketchingtoolbox',
        ];
        vm.footerToolIds = [
            'drawundotool',
            'drawredotool',
            'drawcanceltool',
        ];

        const tool = {
            id: 'constructionpolylinetool',
            active: false,
            mode: '',
            items: ['drawpolylinetool'],
        };

        vm._searchToolsForToggle = function () {
            return 'sketchinglinegroup';
        };
        vm._setToggle(tool);

        expect(vm.toggle).to.equal('sketchinglinegroup');

        vm.constructionTool = 'drawpolygontool';
        vm._setToggle(tool);
        expect(vm.toggle).to.equal('sketchinglinegroup');

        tool.mode = 'construction';
        vm._setToggle(tool);
        expect(vm.toggle).to.equal('sketchinglinegroup');

        tool.active = true;
        tool.mode = '';
        vm.constructionTool = null;
        vm._setToggle(tool);
        expect(vm.toggle).to.equal(null);
    },

    'activate SymbolEditor': function () {
        const vm = new Vue(SketchingWidget);
        vm.symbolEditorOpen = false;
        const tool = {
            mode: '',
            active: false,
        };
        vm._setSettings = function () {
            return null;
        };
        vm._toggleSymbolEditor(tool);
        expect(vm.symbolEditorOpen).to.equal(true);
    },

    'deactivate SymbolEditor when clicking construction tool twice': function () {
        const vm = new Vue(SketchingWidget);
        vm.symbolEditorOpen = true;
        vm.constructionTool = 'drawpolylinetool';
        const tool = {
            mode: 'construction',
            active: false,
            items: ['drawpolylinetool'],
        };

        vm._toggleSymbolEditor(tool);
        expect(vm.symbolEditorOpen).to.equal(false);
    },
});
