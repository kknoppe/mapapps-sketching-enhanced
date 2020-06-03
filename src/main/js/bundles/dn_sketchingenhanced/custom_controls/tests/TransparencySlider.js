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
import TransparencySlider from '../control/TransparencySlider.vue';

function instanciateWithProps(component, propsData) {
    const Constructor = Vue.extend(component);
    return new Constructor({
        propsData,
    });
}

registerSuite({
    name: module.id,

    'Transparency slider Vue Component': function () {
        assert.ok(new Vue(TransparencySlider));
    },

    'default data is set': function () {
        expect(typeof TransparencySlider.data).to.be.equal('function');
        const defaultData = TransparencySlider.data();
        expect(defaultData.max).to.be.equal(100);
        expect(defaultData.step).to.be.equal(1);
    },

    'maxTransparency is set': function () {
        const vm = instanciateWithProps(TransparencySlider, {
            maxTransparency: 80,
        });
        expect(vm.max).to.be.equal(80);
    },

    'layerOpacity is set': function () {
        const vm = instanciateWithProps(TransparencySlider, {
            layerOpacity: 0.3,
        });
        expect(vm.transparency).to.be.equal(70);
    },

    'trigger output event on slider changes': function () {
        const vm = instanciateWithProps(TransparencySlider, {
            layerOpacity: 0.3,
            i18n: {
                transparency: 'test',
            },
        });
        vm.$on('opacity-changed', v => {
            expect(v).to.be.equal(0.4);
        });
        vm.onChange(60);
    },
});
