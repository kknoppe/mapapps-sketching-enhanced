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
import {beforeEach, describe, it} from 'intern!bdd';
import expect from 'intern/chai!expect';
import sinon from 'sinon';
import module from 'module';
import LayerRegistry from '../LayerRegistry';
import ConfiguredLayer from 'map_settings/ConfiguredLayer';
import FeatureLayer from 'esri/layers/FeatureLayer';
import GraphicsLayer from 'esri/layers/GraphicsLayer';
import SymbolEditorModel from "../SymbolEditorModel";
import ScaleSettings from "../ScaleSettings";
import LabelSettings from "../LabelSettings";
import SymbolSettings from "../SymbolSettings";

const _createComponent = () => new LayerRegistry();

describe(module.id, function () {
    let comp = null;
    let layer = null;
    let graphicsLayer = null;
    let config = null;
    let createSettings = () => {
        const settings = new SymbolEditorModel();
        settings.registry = this;
        settings.scaleSettings = new ScaleSettings();
        settings.labelSettings = new LabelSettings();
        settings.symbolSettings = new SymbolSettings();
        return settings;
    };
    beforeEach(function () {
        comp = _createComponent();
        layer = new FeatureLayer();
        layer.fields = [
            {name: 'OBJECTID', alias: 'OBJECTID', type: 'oid'},
            {name: 'SHAPE', alias: 'SHAPE', type: 'geometry'},
            {name: 'SHAPE.AREA', alias: 'AREA', type: 'double'},
            {name: 'SHAPE.LEN', alias: 'LEN', type: 'double'},
            {name: 'GLOBALID', alias: 'GLOBALID', type: 'global-id'},
            {name: 'myString', alias: 'the first', type: 'string'},
            {name: 'myDouble', alias: 'the second', type: 'double'},
            {name: 'mySmallInteger', alias: 'the third', type: 'small-integer'},
            {name: 'myInteger', alias: 'the fourth', type: 'integer'},
            {name: 'mySingle', alias: 'the fifth', type: 'single'},
            {name: 'myLong', alias: 'the sixth', type: 'long'},
            {name: 'myDate', alias: 'the seventh', type: 'date'},
            {name: 'myBlob', alias: 'the eighth', type: 'blob'},
            {name: 'myRaster', alias: 'the nineth', type: 'raster'},
            {name: 'myGUID', alias: 'the tenth', type: 'guid'},
            {name: 'myXML', alias: 'the eleventh', type: 'xml'},
        ];
        config = new ConfiguredLayer({});
    });

    it('should load settings for feature layer', async function () {
        sinon.stub(comp, '_loadLayerSettings').callsFake(() => {});
        sinon.stub(comp, '_loadGraphicsSettings').callsFake(() => {});

        comp._transform(layer, config);
        expect(comp._loadLayerSettings.calledOnce).to.equal(true);
        expect(comp._loadGraphicsSettings.calledOnce).to.equal(false);
    });

    it('should load settings for graphicslayer', async function () {
        sinon.stub(comp, '_loadLayerSettings').callsFake(() => {});
        sinon.stub(comp, '_loadGraphicsSettings').callsFake(() => {});

        const graphicsLayer = new GraphicsLayer();
        comp._transform(graphicsLayer, config);

        expect(comp._loadLayerSettings.calledOnce).to.equal(false);
        expect(comp._loadGraphicsSettings.calledOnce).to.equal(true);
    });

    it('should set labelSettings to not allowed by default', async function () {
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.allowed).to.equal(false);
    });

    it('should set labelSettings to allowed by config', async function () {
        config.labelingAllowed = true;
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.allowed).to.equal(true);
    });

    it('should set fields for labeling from layer', async function () {
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.fields.length).to.be.above(0);
    });

    it('should only set fields for labeling with a valid type', async function () {
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.fields).to.have.lengthOf(8);
    });

    it('should set fields for labeling from config', async function () {
        config.allowedFieldsForLabeling = ['OBJECTID', 'myDouble'];
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.fields).to.have.lengthOf(2);
        expect(actual.fields[0].name).to.equal('OBJECTID');
        expect(actual.fields[1].name).to.equal('myDouble');
    });

    it('should exclude wrong configured fields for labeling', async function () {
        config.allowedFieldsForLabeling = ['OBJECTID', 'myDouble', 'invalidField'];
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.fields).to.have.lengthOf(2);
        expect(actual.fields[0].name).to.equal('OBJECTID');
        expect(actual.fields[1].name).to.equal('myDouble');
    });

    it('should set visibility of layer by config', async function () {
        config.showLabelByDefault = true;
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.visible).to.equal(true);
    });

    it('should set field for labeling to first field of layer', async function () {
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.fieldForLabeling).to.equal('OBJECTID');
    });

    it('should set field for labeling to first field of config', async function () {
        config.allowedFieldsForLabeling = ['myDouble', 'OBJECTID'];
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.fieldForLabeling).to.equal('myDouble');
    });

    it('should set default field to first field of layer', async function () {
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.defaultField).to.equal('OBJECTID');
    });

    it('should set default field to first field of config', async function () {
        config.allowedFieldsForLabeling = ['myDouble', 'OBJECTID'];
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.defaultField).to.equal('myDouble');
    });

    it('should set warning to true when layer has no labelingInfo', async function () {
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.warning).to.equal(true);
    });

    it('should the defaultField to the field from the labelinginfo', async function () {
        layer.labelingInfo = [{labelExpression: '[myDouble]'}];
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.defaultField).to.equal('myDouble');
    });

    it('should the fieldForLabeling to the field from the labelinginfo', async function () {
        layer.labelingInfo = [{labelExpression: '[myDouble]'}];
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.fieldForLabeling).to.equal('myDouble');
    });


    it('should add the default field to the fields', async function () {
        const expected = 'myInteger';
        config.allowedFieldsForLabeling = ['OBJECTID'];
        layer.labelingInfo = [{labelExpression: `[${expected}]`}];
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.fields).to.have.lengthOf(2);
        expect(actual.fields.some(x => x.name === expected)).to.equal(true);
    });

    it('should ignore wrong label expression from service (CTRAGDSA-1706)', async function () {
        layer.labelingInfo = [{labelExpression: `[InvalidConfig]`}];
        const settings = createSettings();
        comp._loadLayerSettings(layer, config, settings);
        const actual = settings.labelSettings;
        expect(actual.fields).to.have.lengthOf(8);
        expect(actual.defaultField).to.equal('OBJECTID');
        expect(actual.fieldForLabeling).to.equal('OBJECTID');
    });

    it('GraphicsLayer without graphics should not be editable', async function () {
        const settings = createSettings();
        const graphicsLayer = new GraphicsLayer();
        graphicsLayer.graphics.items = [];

        comp._loadGraphicsSettings(graphicsLayer, config, settings);
        expect(settings.symbolSettings.allowed).to.equal(false);
    });

    it('Symbology of graphicsLayer with graphics of the same geometry type can be changed', async function () {
        const layerRegistry = _createComponent();
        layerRegistry.addSymbolSettings = () => {};
        config.changeSymbologyAllowed = true;

        const settings = createSettings();
        const geometryType = 'point';
        const graphicsLayer = new GraphicsLayer();
        graphicsLayer.graphics.items = [
            {
                geometry: {
                    type: 'point',
                    symbol: '',
                },
            },
            {
                geometry: {
                    type: 'point',
                    symbol: '',
                },
            },
        ];
        layerRegistry._loadGraphicsSettings(graphicsLayer, config, settings);
        expect(settings.symbolSettings.allowed).to.equal(true);
        expect(settings.symbolSettings.geometryType).to.equal(geometryType);
    });

    it('Symbology of graphicsLayer with graphics of the same geometry type can not be changed', async function () {
        const layerRegistry = _createComponent();
        layerRegistry.addSymbolSettings = () => {};
        config.changeSymbologyAllowed = true;

        const settings = createSettings();
        const geometryType = 'point';
        const graphicsLayer = new GraphicsLayer();
        graphicsLayer.graphics.items = [
            {
                geometry: {
                    type: 'point',
                    symbol: '',
                },
            },
            {
                geometry: {
                    type: 'polyline',
                    symbol: '',
                },
            },
        ];
        layerRegistry._loadGraphicsSettings(graphicsLayer, config, settings);
        expect(settings.symbolSettings.allowed).to.equal(false);
    });
});

