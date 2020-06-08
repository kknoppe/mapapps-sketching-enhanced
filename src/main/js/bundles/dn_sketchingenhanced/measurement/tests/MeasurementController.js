import registerSuite from 'intern!object';
import assert from 'intern/chai!assert';
import expect from 'intern/chai!expect';
import module from 'module';
import MeasurementController from '../MeasurementController';
import geoEngine from 'esri/geometry/geometryEngine';
import Polyline from 'esri/geometry/Polyline';
import Polygon from 'esri/geometry/Polygon';

registerSuite({
    name: module.id,
    'Measurement Controller': function () {
        assert.ok(new MeasurementController());
    },
    'Calculate length for a short line': function() {
        const controller = new MeasurementController();
        controller.geoEngine = geoEngine;
        const spatialReference = {
            wkid: 31466,
        };
        const path = [[0,0],[0,20]];
        const length = controller._getLength(new Polyline(path, spatialReference));
        expect(length).to.equal('20 m');
    },
    'Calculate length for a long line': function() {
        const controller = new MeasurementController();
        controller.geoEngine = geoEngine;
        const spatialReference = {
            wkid: 31466,
        };
        const path = [[0,0],[0,2000]];
        const length = controller._getLength(new Polyline(path, spatialReference));
        expect(length).to.equal('2 km');
    },
    'Calculate area for a small polygon': function() {
        const controller = new MeasurementController();
        controller.geoEngine = geoEngine;
        const spatialReference = {
            wkid: 31466,
        };
        const rings = [[0,0],[0,2],[1,2], [1,0]];
        const area = controller._getArea(new Polygon(rings, spatialReference));
        expect(area).to.equal('2 m²');
    },
    'Calculate area for a big polygon': function() {
        const controller = new MeasurementController();
        controller.geoEngine = geoEngine;
        const spatialReference = {
            wkid: 31466,
        };
        const rings = [[0, 0], [0, 2000], [2000, 2000], [2000, 0]];
        const area = controller._getArea(new Polygon(rings, spatialReference));
        expect(area).to.equal('4 km²');
    },
    'get text position': function() {
        const controller = new MeasurementController();
        let path = [[0,0],[0,20]];
        expect(controller._getTextPosition(path)).to.equal('center');
        path = [[0,0],[0,-20]];
        expect(controller._getTextPosition(path)).to.equal('center');
        path = [[0,0],[20,0]];
        expect(controller._getTextPosition(path)).to.equal('left');
        path = [[0,0],[-20,0]];
        expect(controller._getTextPosition(path)).to.equal('right');
        path = [[0,0],[-20,20]];
        expect(controller._getTextPosition(path)).to.equal('right');
        path = [[0,0],[20,20]];
        expect(controller._getTextPosition(path)).to.equal('left');
    },
    'get text y offset': function() {
        const controller = new MeasurementController();
        let path = [[0,0],[0,20]];
        let offset = controller._getYOffset(path);
        expect(offset/Math.abs(offset)).to.equal(1);
        path = [[0,0],[0,-20]];
        offset = controller._getYOffset(path);
        expect(offset/Math.abs(offset)).to.equal(-1);
        path = [[0,0],[20,0]];
        offset = controller._getYOffset(path);
        expect(offset).to.equal(0);
        path = [[0,0],[-20,0]];
        offset = controller._getYOffset(path);
        expect(offset).to.equal(0);
        path = [[0,0],[-20,20]];
        offset = controller._getYOffset(path);
        expect(offset/Math.abs(offset)).to.equal(1);
        path = [[0,0],[20,20]];
        offset = controller._getYOffset(path);
        expect(offset/Math.abs(offset)).to.equal(1);
        path = [[0,0],[20,-20]];
        offset = controller._getYOffset(path);
        expect(offset/Math.abs(offset)).to.equal(-1);
    },
});