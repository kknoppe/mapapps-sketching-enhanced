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
import LayerRegistryList from '../../model/LayerRegistryList';
import LayerListItem from '../../model/LayerRegistryItem';
import {describe, it} from 'intern!bdd';

const _createComponent = () => new LayerRegistryList();
const _createMockItem = (id, source) => {
    const item = new LayerListItem();
    item.settings = {id, source};
    return item;
};


describe(module.id, () => {

    it('should not throw error when created', () => {
        expect(_createComponent()).to.be.an('object');
    });

    it('should return an added item', () => {
        const comp = _createComponent();
        const item = _createMockItem(1, 'abc');

        comp.add(item);
        const actual = comp.get({id: 1, source: 'abc'});

        expect(typeof actual).to.equal('object');
        expect(actual.settings.id).to.equal(1);
        expect(actual.settings.source).to.equal('abc');
    });

    it('should be able to add more than 1 item', () => {
        const comp = _createComponent();
        const item1 = _createMockItem(1, 'abc');
        const item2 = _createMockItem(2, 'abc');

        comp.add(item1);
        comp.add(item2);

        const actual = comp[Object.getOwnPropertySymbols(comp)[0]].length;

        expect(actual).to.equal(2);
    });

    it('should replace an existing item', () => {
        const comp = _createComponent();
        const item1 = _createMockItem(1, 'abc');
        const item2 = _createMockItem(2, 'abc');
        const item3 = _createMockItem(1, 'abc');

        comp.add(item1);
        comp.add(item2);
        comp.add(item3);

        const actualLength = comp[Object.getOwnPropertySymbols(comp)[0]].length;
        const actual = comp.get({id: 1, source: 'abc'});

        expect(actualLength).to.equal(2);
        expect(actual).to.equal(item3);
    });

    it('should return all items', () => {
        const comp = _createComponent();
        const item1 = _createMockItem(1, 'abc');
        const item2 = _createMockItem(2, 'abc');

        comp.add(item1);
        comp.add(item2);

        const actual = comp.getAll();

        expect(actual).to.be.an('array');
        expect(actual).to.have.lengthOf(2);
    });

    it('should clear all items', () => {
        const comp = _createComponent();
        const item1 = _createMockItem(1, 'abc');
        const item2 = _createMockItem(2, 'abc');

        comp.add(item1);
        comp.add(item2);

        comp.clear();
        const actual = comp.getAll();

        expect(actual).to.be.an('array');
        expect(actual).to.have.lengthOf(0);
    });

    it('should remove an item', () => {
        const comp = _createComponent();
        const item1 = _createMockItem(1, 'abc');
        const item2 = _createMockItem(2, 'abc');

        comp.add(item1);
        comp.add(item2);

        comp.remove({id: 1, source: 'abc'});
        const actual = comp.getAll();

        expect(actual).to.be.an('array');
        expect(actual).to.have.lengthOf(1);
    });
});
