import type SpatialReference from "esri/geometry/SpatialReference";
import type Point from "esri/geometry/Point";
import type MapView from "esri/views/MapView";
import Polyline from "esri/geometry/Polyline";
import * as geoEngine from 'esri/geometry/geometryEngine';
import ct_geometry from "ct/mapping/geometry";

export class AngleCalculator {

    public p1: Point;
    public p2: Point;
    public p3: Point;
    public anglePoint: Point;
    public mapWidgetModel: { view: MapView };

    constructor(p1: Point, p2: Point, p3: Point, anglePoint: Point, mapWidgetModel: { view: MapView }) {
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.anglePoint = anglePoint;
        this.mapWidgetModel = mapWidgetModel;
    }

    public getAngle(): string {
        return this.calculateAngle(this.p1, this.p2, this.p3);
    }

    private calculateAngle(p1: Point, p2: Point, p3: Point): string {
        const quadrantsString = this.getQuadrantString();
        return this._calculateAngle(p1, p2, p3, quadrantsString);
    }

    private getQuadrantString(): string {
        // calculate quadrant relative to p1
        const p2quadrant = this._getQuadrant(this.p2, this.p1);
        const p3quadrant = this._getQuadrant(this.p3, this.p1);
        return [p2quadrant, p3quadrant].join(' ');
    }

    private _getQuadrant(point: Point, relativeTo: Point): number {
        const tempPoint = {
            x: point.x - relativeTo.x,
            y: point.y - relativeTo.y
        };
        if (tempPoint.x >= 0 && tempPoint.y >= 0) return 1;
        if (tempPoint.x >= 0 && tempPoint.y <= 0) return 2;
        if (tempPoint.x <= 0 && tempPoint.y <= 0) return 3;
        if (tempPoint.x <= 0 && tempPoint.y >= 0) return 4;
    }

    /*
     * calculate angles using points
     * @param p1, p2, p3: points used for calulation
     * @private
     */
    private _calculateAngle(p1: Point, p2: Point, p3: Point, quadrantsString: string): string {
        // construction of right triangles from p1, p2 and p1, p3
        // calculating angle at p1
        const a = Math.atan((Math.abs(p2.y - p1.y) / Math.abs(p2.x - p1.x))) * 180 / Math.PI;
        const b = Math.atan((Math.abs(p3.y - p1.y) / Math.abs(p3.x - p1.x))) * 180 / Math.PI;
        let _angleButton_meas = 0;
        switch (quadrantsString) {
            case '1 1':
                _angleButton_meas = (Math.abs(b - a));
                if (b < a) _angleButton_meas = (360 - _angleButton_meas);
                break;
            case '2 1':
                _angleButton_meas = 360 - (360 - (a + b));
                break;
            case '3 1':
                _angleButton_meas = 360 - (180 + a - b);
                break;
            case '4 1':
                _angleButton_meas = 360 - (180 - (a + b));
                break;
            case '1 2':
                _angleButton_meas = 360 - (a + b);
                break;
            case '2 2':
                _angleButton_meas = (Math.abs(a - b));
                if (a < b) _angleButton_meas = (360 - _angleButton_meas);
                break;
            case '3 2':
                _angleButton_meas = 360 - (360 - (180 - (a + b)));
                break;
            case '4 2':
                _angleButton_meas = 360 - (180 - a + b);
                break;
            case '1 3':
                _angleButton_meas = 360 - (180 + a - b);
                break;
            case '2 3':
                _angleButton_meas = 360 - (180 - (a + b));
                break;
            case '3 3':
                _angleButton_meas = (Math.abs(b - a));
                if (b < a) _angleButton_meas = (360 - _angleButton_meas);
                break;
            case '4 3':
                _angleButton_meas = 360 - (360 - (a + b));
                break;
            case '1 4':
                _angleButton_meas = 360 - (360 - (180 - (a + b)));
                break;
            case '2 4':
                _angleButton_meas = 360 - (180 - a + b);
                break;
            case '3 4':
                _angleButton_meas = 360 - (a + b);
                break;
            case '4 4':
                _angleButton_meas = (Math.abs(a - b));
                if (a < b) _angleButton_meas = (360 - _angleButton_meas);
                break;
            default:
                console.warn("error");
                break;
        }

        return _angleButton_meas.toFixed(0).toString();
    }

    public getPoint(): Point {
        return this._calcPointInQuadrant(this.anglePoint);
    }

    private _calcPointInQuadrant(anglePoint: Point): Point {
        let manipulateX = 0;
        let manipulateY = 0;
        const pixelDistance = 25; // pixel
        const spatialReference = anglePoint.spatialReference;
        const quadrantsString = this.getQuadrantString();

        // calc the distance
        const mapPointNew = this._calcGeoPointForPixelDistance(anglePoint, pixelDistance, pixelDistance);
        const line = new Polyline({ spatialReference });
        line.addPath([anglePoint, mapPointNew]);
        // get distance between p1 and the new mapPoint
        const geomDistance = geoEngine.planarLength(line, undefined);


        switch (quadrantsString) {
            case '1 1':
            case '4 2':
                manipulateX -= geomDistance;
                manipulateY -= geomDistance;
                break;
            case '2 1':
                // angle must be <= 180°
                break;
            case '4 1':
                manipulateY -= geomDistance;
                break;
            case '1 2':
                manipulateX -= geomDistance;
                break;
            case '2 2':
            case '1 3':
                manipulateX -= geomDistance;
                manipulateY += geomDistance;
                break;
            case '3 2':
                // angle must be <= 180°
                break;
            case '2 3':
                manipulateY += geomDistance;
                break;
            case '3 3':
            case '2 4':
                manipulateX += geomDistance;
                manipulateY += geomDistance;
                break;
            case '4 3':
                // angle must be <= 180°
                break;
            case '1 4':
                // angle must be <= 180°
                break;
            case '3 4':
                manipulateX += geomDistance;
                break;
            case '4 4':
            case '3 1':
                manipulateX += geomDistance;
                manipulateY -= geomDistance;
                break;
            default:
                console.warn("error");
                break;
        }
        return ct_geometry.createPoint(anglePoint.x + manipulateX, anglePoint.y + manipulateY, spatialReference);
    }

    private _calcGeoPointForPixelDistance(srcPoint: Point, distanceInPxX: number, distanceInpxY: number): Point {
        const screenPointOfP1 = this.mapWidgetModel.view.toScreen(srcPoint);

        return this.mapWidgetModel.view.toMap({
            x: screenPointOfP1.x + distanceInPxX,
            y: screenPointOfP1.y + distanceInpxY
        });
    }
}