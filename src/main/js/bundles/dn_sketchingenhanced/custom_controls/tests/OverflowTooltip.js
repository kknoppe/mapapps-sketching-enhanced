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
import {after, afterEach, before, beforeEach, describe, it} from 'intern!bdd';
import expect from 'intern/chai!expect';
import Vue from 'apprt-vue/Vue';
import Vuetify from 'vuetify';
import OverflowTooltip from '../control/OverflowTooltip.vue';

Vue.use(Vuetify);

const _createComponent = () => {
    return new Vue(OverflowTooltip);
};

describe(module.id, () => {
    let backup = null;
    let comp = null;
    
    before(() => {
        backup = window.ResizeObserver;
        window.ResizeObserver = class {
            constructor(c) {
                this.callback = c;
            }

            observe() {
            }

            disconnect() {
            }
        }
    });
    after(() => (window.ResizeObserver = backup));

    beforeEach(() => {
        comp = _createComponent();
        comp.$slots.activator = 'content';
        comp.$mount();
        document.querySelector('body').appendChild(comp.$el);
    });
    afterEach(() => document.querySelector('body').removeChild(comp.$el));

    it('should set overflow to false by default', () => {
        expect(comp.overflow).to.equal(false);
    });

    it('should activate tooltip with long content', async () => {
        comp.$el.style.width = '1px';
        comp.observer.callback([{target: comp.$el}]);
        await Vue.nextTick();
        expect(comp.$children[0].disabled).to.equal(false);
    });

    it('should deactivate tooltip with short content', async () => {
        comp.$el.style.width = '1000px';
        comp.observer.callback([{target: comp.$el}]);
        await Vue.nextTick();
        expect(comp.$children[0].disabled).to.equal(true);
    });

    describe('Fallback: ResizeSensor', () => {
        let callback = null;

        beforeEach(() => {
            document.querySelector('body').removeChild(comp.$el);
            
            window.ResizeObserver = null;
            window.ResizeSensor = (el,cb) => (callback=cb);
            
            comp = _createComponent();
            comp.$slots.activator = 'content';
            comp.$mount();
            document.querySelector('body').appendChild(comp.$el);
        });
        
        it('should deactivate tooltip with short content', async () => {
            comp.$el.style.width = '1000px';
            callback([{target: comp.$el}]);

            await Vue.nextTick();
            expect(comp.$children[0].disabled).to.equal(true);
        });

        it('should activate tooltip with long content', async () => {
            comp.$el.style.width = '1px';
            callback([{target: comp.$el}]);

            await Vue.nextTick();
            expect(comp.$children[0].disabled).to.equal(false);
        });

        it('should tolarate miscalculation bug from IE / MS Edge', async () => {
            comp.$el.style.width = '46px'; // 1 pixel too small
            callback([{target: comp.$el}]);

            await Vue.nextTick();
            expect(comp.$children[0].disabled).to.equal(true);
        });
});
});
