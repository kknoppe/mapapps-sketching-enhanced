import {Mutable, properties} from 'apprt-core/Mutable';

class MeasurementModel extends Mutable {

    constructor() {
        super();
    }
}

properties(MeasurementModel, {
    showLineMeasurementsAtPolylines: false,
    showLineMeasurementsAtPolygons: false,

    currentLength: 0,
    aggregateLength: 0,
    totalLength: 0,
    area: 0,
    currentArea: 0,
    perimeter: 0,
    coordinates: null,

    measurementBoolean: false,

    pointEnabled: false,
    polylineEnabled: false,
    polygonEnabled: false,
    areaEnabled: false

});


export default MeasurementModel;
