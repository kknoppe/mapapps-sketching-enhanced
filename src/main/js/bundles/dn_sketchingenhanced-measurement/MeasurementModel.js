import {Mutable, properties} from 'apprt-core/Mutable';

class MeasurementModel extends Mutable {

    constructor() {
        super();
    }
}

properties(MeasurementModel, {
    showLineMeasurementsAtPolylines: false,
    showLineMeasurementsAtPolygons: false,
});


export default MeasurementModel;
