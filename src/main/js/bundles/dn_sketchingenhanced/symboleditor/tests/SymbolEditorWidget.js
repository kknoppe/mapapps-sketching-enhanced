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
import module from 'module';
import {afterEach, beforeEach, describe, it} from 'intern!bdd';
import expect from 'intern/chai!expect';
import Vue from 'apprt-vue/Vue';
import Vuetify from 'vuetify';
import SymbolEditorWidgetFactory from '../SymbolEditorWidgetFactory';
import SymbolEditorWidget from '../SymbolEditorWidget.vue';
import PointSetting from '../model/PointSetting';
import {later} from 'unit_tests/later';
import SymbolEditorModel from '../SymbolEditorModel';

Vue.use(Vuetify);

const _createComponent = async () => {
    const factory = new SymbolEditorWidgetFactory();
    factory._layerRegistry = {models: [], _getScales: () => [100, 200, 300], getLayer: () => new SymbolEditorModel()};
    if (!Vue.component('layer-editor')) {
        factory.activate();
    }
    const comp = SymbolEditorWidget;
    comp.propsData = {layer: {id: 1}};
    const vm = new Vue(SymbolEditorWidget);
    await Vue.nextTick();
    return vm;
};

// Write here the unit tests with "describe" and "it"...
describe(module.id, () => {
    it('should not throw error when mounted', async () => {
        const comp = await _createComponent();
        comp.i18n = {tooltip: {}, insertSelectionDialog: {}};
        let error = '';
        Vue.config.errorHandler = msg => (error = msg.message);

        comp.$mount();
        expect(error).to.be.empty;

        Vue.config.errorHandler = null;
        comp.$destroy();
    });

    false && describe(module.id + '/symbol/single', (test) => {
        let comp, symbolBtn, editorSwitch, simpleEditor, colors, applyButton, revertButton;

        beforeEach(async () => {
            comp = await _createComponent();
            comp.symbolSettings.allowed = true;
            comp.symbolSettings.defaultSymbol = new PointSetting();
            comp.model.registry = {
                getLayerFromMap: () => ({sublayers: {items: [{renderer: {}}]}})
            };

            comp.$mount();
            document.querySelector('body').appendChild(comp.$el);
            symbolBtn = comp.$el.querySelectorAll('.openEditorBtn')[2];

            // select symboleditor
            symbolBtn.click();
            await Vue.nextTick();

            // open symboleditor
            editorSwitch = comp.$el.querySelectorAll('.v-input--switch input')[0];
            editorSwitch.click();
            await Vue.nextTick();

            simpleEditor = comp.$el.querySelectorAll('.simpleSymbolEditor')[0];
            colors = simpleEditor.querySelectorAll('.vc-sketch-presets-color');
            applyButton = comp.$el.querySelectorAll('.v-card__actions button')[0];
            revertButton = comp.$el.querySelectorAll('.v-card__actions button')[1];
        });

        afterEach(() => {
            comp.$destroy();
            document.body.removeChild(comp.$el);
        });

        it('should apply selected color to default symbol of model', async () => {
            // select new color
            colors[2].click();
            await Vue.nextTick();
            applyButton.click();
            await Vue.nextTick();

            return later(() => {
                expect(comp.model.appliedState.symbolSettings.defaultSymbol.color.r).to.equal(238);
            });
        });

        it('should revert choice of color', async () => {
            // select new color
            colors[2].click();
            await Vue.nextTick();
            revertButton.click();
            await Vue.nextTick();

            return later(() => {
                expect(comp.model.appliedState.symbolSettings.defaultSymbol.color.r).to.equal(0);
                expect(comp.symbolSettings.defaultSymbol.color.r).to.equal(0);
            });
        });
    });
});
