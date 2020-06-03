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
import DropZone from '../form/DropZone.vue';
import {describe, it} from 'intern!bdd';
import {getClassNames} from 'unit_tests/dom';
import later from 'unit_tests/later';

const _createComponent = () => new Vue(DropZone);

describe(module.id, () => {

    it('should not throw when created', () => {
        expect(_createComponent()).to.be.an('object');
    });

    it('should contain an input of type file', () => {
        const comp = _createComponent();
        comp.$mount();

        expect(comp.$el.querySelector('input').type).to.equal('file');
    });

    it('should not apply multiple by default', () => {
        const comp = _createComponent();
        comp.$mount();

        expect(comp.$el.querySelector('input').multiple).to.equal(false);
    });

    it('should apply multiple to input when set', () => {
        const comp = _createComponent();

        comp.multiple = true;
        comp.$mount();

        expect(comp.$el.querySelector('input').multiple).to.equal(true);
    });

    it('should apply accept to input when set', () => {
        const comp = _createComponent();

        comp.allowedFiles = ['pdf', 'jpg'];
        comp.$mount();
        const fileInput = comp.$el.querySelector('input');

        expect(fileInput.accept).to.equal('.pdf,.jpg');
    });

    it('should not have an error on init', () => {
        const comp = _createComponent();

        expect(comp.error).to.equal('');
    });

    it('should not print an error on init', () => {
        const comp = _createComponent();

        comp.$mount();
        const errText = comp.$el.querySelector('.error-text').textContent;

        expect(errText).to.equal('');
    });

    it('should not have dragover class on init', () => {
        const comp = _createComponent();

        comp.$mount();
        const zone = comp.$el.querySelector('.dz');

        expect(getClassNames(zone)).to.not.include('dragover');
    });

    it('should have dragover class on dz while dragging over', () => {
        const comp = _createComponent();
        const dragEvent = new Event('dragover');

        comp.$mount();
        const zone = comp.$el.querySelector('.dz');
        zone.dispatchEvent(dragEvent);

        return later(() => expect(getClassNames(zone)).to.include('dragover'));
    });

    it('should remove dragover class on dragleave', () => {
        const comp = _createComponent();
        const dragEvent = new Event('dragover');
        const dragleaveEvent = new Event('dragleave');

        comp.$mount();
        const zone = comp.$el.querySelector('.dz');
        zone.dispatchEvent(dragEvent);
        zone.dispatchEvent(dragleaveEvent);

        return later(() => expect(getClassNames(zone)).to.not.include('dragover'));
    });

    it('should remove dragover class on drop', () => {
        const comp = _createComponent();
        const dragEvent = new Event('dragover');
        const dropEvent = new Event('drop');

        comp.$mount();
        const zone = comp.$el.querySelector('.dz');
        const fileInput = comp.$el.querySelector('input');

        zone.dispatchEvent(dragEvent);
        zone.dispatchEvent(dropEvent);

        return later(() => expect(getClassNames(zone)).to.not.include('dragover'));
    });

    it('should show error when file is invalid', () => {
        const comp = _createComponent();
        const testFile = new File(['content'], 'filename.txt');
        comp.allowedFiles = ['zip'];
        comp.$mount();

        comp._processFiles([testFile]);

        return later(() => expect(comp.$el.querySelector('.error-text').textContent).to.not.equal(''));
    });

    it('should not show error when file is valid', () => {
        const comp = _createComponent();
        const testFile = new File(['content'], 'filename.txt');
        comp.allowedFiles = ['txt'];
        comp.$mount();

        comp._processFiles([testFile]);

        return later(() => expect(comp.$el.querySelector('.error-text').textContent).to.equal(''));
    });

    it('should emit change when file is valid', () => {
        const comp = _createComponent();
        let flag = false;
        const testFile = new File(['content'], 'filename.txt');
        comp.allowedFiles = ['txt'];
        comp.$on('change', () => {
            flag = true;
        });

        comp._processFiles([testFile]);

        expect(flag).to.equal(true);
    });

    it('should not emit change when file is invalid', () => {
        const comp = _createComponent();
        let flag = false;
        const testFile = new File(['content'], 'filename.txt');
        comp.allowedFiles = ['zip'];
        comp.$on('change', () => {
            flag = true;
        });

        comp._processFiles([testFile]);

        expect(flag).to.equal(false);
    });
});
