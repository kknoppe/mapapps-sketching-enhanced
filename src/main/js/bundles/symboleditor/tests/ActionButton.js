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
import Vuetify from 'vuetify';
import ActionButton from '../components/ActionButton.vue';

Vue.use(Vuetify);

const _createComponent = () => {
    const comp = new Vue(ActionButton);
    comp.icon = 'myIcon';
    return comp;
};

registerSuite({
    name: module.id,
    'ActionButton Vue Component': function () {
        expect(_createComponent()).to.be.an('object');
    },

    'Icon is displayed': function () {
        const comp = _createComponent();
        comp.$mount();
        const actual = comp.$el.querySelector('.v-icon').innerHTML;
        expect(actual).to.include('myIcon');
    },

    'Button is enabled': function () {
        const comp = _createComponent();
        comp.$mount();
        const actual = comp.$el.querySelector('.v-btn').getAttribute('disabled');
        expect(actual).to.equal(null);
    },

    'Button could be disabled': function () {
        const comp = _createComponent();
        comp.disabled = true;
        comp.$mount();
        const actual = comp.$el.querySelector('.v-btn').getAttribute('disabled');
        expect(actual).to.equal('disabled');
    },
});
