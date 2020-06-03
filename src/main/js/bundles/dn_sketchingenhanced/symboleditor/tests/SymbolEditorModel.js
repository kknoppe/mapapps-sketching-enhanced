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
import SymbolEditorModel from '../SymbolEditorModel';

const _createComponent = () => new SymbolEditorModel();

registerSuite({
    name: module.id,

    'SymbolEditor model Component': function () {
        expect(_createComponent()).to.be.an('object');
    },

    'selectedLayerId is a string and it is a void string if the parameter of selectedLayer function is undefined': function () {
        expect(_createComponent().selectedLayerId).to.be.an('string');
        _createComponent().layerSelected();
        expect(_createComponent().selectedField).to.equal('');
    },
});
