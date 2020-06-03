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
import expect from 'intern/chai!expect';
import module from 'module';
import Vue from 'apprt-vue/Vue';
import ConfirmationDialog from '../layout/ConfirmationDialog.vue';
import {describe, it} from 'intern!bdd';
import {endBeforeTimeout} from 'unit_tests/later';

const _createComponent = () => new Vue(ConfirmationDialog);

describe(module.id, () => {

    it('should not throw when created', () => {
        expect(_createComponent()).to.be.an('object');
    });

    it('should be hidden on init', () => {
        const comp = _createComponent();
        expect(comp.show).to.equal(false);
    });

    it('should be visible while asking', () => {
        const comp = _createComponent();

        comp.ask();

        expect(comp.show).to.equal(true);
    });

    it('should be hidden after abort', () => {
        const comp = _createComponent();

        comp.ask().catch(() => {
            // catch rejected promise
        });
        comp.abort();

        expect(comp.show).to.equal(false);
    });

    it('should be hidden after confirm', () => {
        const comp = _createComponent();

        comp.ask();
        comp.$emit('confirm');

        expect(comp.show).to.equal(false);
    });

    it('should resolve promise after confirm', () => {
        const comp = _createComponent();

        const result = comp.ask();
        comp.$emit('confirm');

        return endBeforeTimeout(result);
    });

    it('should not resolve promise after abort', () => {
        const comp = _createComponent();

        const result = comp.ask();
        comp.abort();

        return endBeforeTimeout(result).then(
            () => expect.fail(null, null, 'resolved'),
            e => e === 'abort' || expect.fail(null, null, e.message || e)
        );
    });

});
