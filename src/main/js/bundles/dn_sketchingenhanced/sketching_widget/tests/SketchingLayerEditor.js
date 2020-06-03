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
import SketchingLayerEditor from '../SketchingLayerEditor';

registerSuite({
    name: module.id,
    'Create SketchingLayerEditor': function () {
        const sketchingLayerEditor = new SketchingLayerEditor();
        expect(sketchingLayerEditor).to.be.an('object');
    },

    'Create Graphicslayer with no given graphics in profile': function() {
        const sketchingLayerEditor = new SketchingLayerEditor();
        const profile = {
            content: {
                graphics: [],
            },
        };
        const layer = sketchingLayerEditor.addGraphicsToNewLayer(profile, 'TEST');
        expect(layer).to.be.an('object');
        expect(layer.graphics.items).to.be.an('array');
        expect(layer.graphics.length).to.equal(0);
    },
    'Create Graphicslayer with a given graphics in profile': function() {
        const sketchingLayerEditor = new SketchingLayerEditor();
        const profile = {
            content: {
                styleSettings: {},
                graphics: [{
                    symbol: {
                        type: 'esriSLS',
                    },
                    geometry: {},
                }],
            },
        };
        const layer = sketchingLayerEditor.addGraphicsToNewLayer(profile, 'TEST');

        expect(layer).to.be.an('object');
        expect(layer.graphics.items).to.be.an('array');
        expect(layer.graphics.length).to.equal(1);
        expect(layer.graphics.items[0].symbol.type).to.equal('simple-line');
        expect(layer.graphics.items[0].geometry.type).to.equal('polyline');
    },
});
