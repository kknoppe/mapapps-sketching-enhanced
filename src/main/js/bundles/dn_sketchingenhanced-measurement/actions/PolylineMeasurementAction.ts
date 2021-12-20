///
/// Copyright (C) 2020 con terra GmbH (info@conterra.de)
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///         http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import Point from "esri/geometry/Point";
import type { MeasurementLayer } from "dn_sketchingenhanced-measurement/MeasurementLayer";
import type { MeasurementCalculator } from "dn_sketchingenhanced-measurement/MeasurementCalculator";
import type { MeasurementLabelProvider } from "dn_sketchingenhanced-measurement/labels/MeasurementLabelProvider";
import { getTemporaryState } from "./MeasurementActionUtils";
import type Graphic from "esri/Graphic";
import type { MeasurementAction, MeasurementUpdateEvent } from "./MeasurementAction";
import type { AngleCalculator } from "dn_sketchingenhanced-measurement/AngleCalculator";
import Polyline from "esri/geometry/Polyline";

export default class PolylineMeasurementHandler implements MeasurementAction {
    public actionType = 'polyline';
    private layer: MeasurementLayer;
    private calculator: MeasurementCalculator;
    private labelProvider: MeasurementLabelProvider;
    private angleCalculator: AngleCalculator;

    constructor(layer: MeasurementLayer, calculator: MeasurementCalculator, labelProvider: MeasurementLabelProvider, angleCalculator: AngleCalculator) {
        this.layer = layer;
        this.calculator = calculator;
        this.labelProvider = labelProvider;
        this.angleCalculator = angleCalculator;
    }

    deleteMeasurements(evt: __esri.SketchViewModelDeleteEvent): void {
        this.layer.removeManyMeasurements(evt.graphics);
    }

    async _getMeasurements(evt: __esri.SketchViewModelCreateEvent): Promise<void> {
        if (evt.state === 'active') {
            const promises: Promise<void>[] = [];
            promises.push(this._addAngleMeasurementForPolylines(evt));
            this._addLineMeasurementsToPolylines(evt)

            if (evt?.toolEventInfo?.type === "cursor-update") {
                //this._checkIfPositionHasChanged(evt);
            }
            return Promise.all(promises).then(() => { });
        }
        if (evt.state === 'complete') {
            this._calculateTotalLineMeasurements(evt);
        }
    }

    public async _updateMeasurements(evt: MeasurementUpdateEvent): Promise<void> {
        this._calculateTotalLineMeasurements(evt);
        this._addLineMeasurementsToPolylines(evt);
        this._addAngleMeasurementForPolylines(evt);
    }

    /**
     * check if the current position is still the same as 2 seconds ago
     * -> if yes show line length and (for polygons) circumference & area
     *
     * @param evt
     * @private
     */
    _checkIfPositionHasChanged(evt) {
        this._calculateTotalLineMeasurements(evt);
    }

    private _calculateTotalLineMeasurements(evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent): void {
        const polylines = evt.type === 'create' ? [evt.graphic] : evt.graphics;
        polylines.forEach(line => this._calculateTotalLineMeasurement(line, evt));
    }

    _calculateTotalLineMeasurement(graphic: Graphic, evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent): void {
        const polyline = graphic.geometry as Polyline;
        const path = polyline.paths[0];
        this.layer.removeManyMeasurements([graphic], "fullLength");
        if (path.length < 2) {
            return;
        }
        const length = this.calculator.getLength(polyline);
        const lengthString = this.formatTotalLength(length, evt);

        const [x, y] = path[path.length - 1];
        const pnt = new Point({ x, y, spatialReference: polyline.spatialReference });

        // calculate text position due to last line element
        const textPosition = this.getTextPosition(path);
        const yOffset = this.getYOffset(path);
        this.layer.addMeasurement(pnt, graphic, { text: lengthString, horizontalAlignment: textPosition, yoffset: yOffset, temporary: getTemporaryState(evt) }, "fullLength");
    }

    private formatTotalLength(length: string, evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent): string {
        const sketchCompleted = evt.type === 'create' || evt.type === 'update' ? evt.state === 'complete' : false;
        const labelText = sketchCompleted ? this.labelProvider.getLabel('totalLength') : '';
        const label = labelText?.length ? `${labelText}: ` : '';

        return `${label}${length}`;
    }

    /*
     * get yoffset for total line length
     * @param path: line path
     * @returns {number}
     * @private
     */
    getYOffset(path: number[][]): number {
        const m = this.calculateSlope(path);
        const yOffset = (path[path.length - 2][1] - path[path.length - 1][1]) < 0 ? 15 : -20;
        return (m < 1 && m > -1) ? 0 : yOffset;
    }

    /*
     * get text position for total line length ('left'/'right'/'center')
     * @param path: line path
     * @returns {String}: ('left'/'right'/'center')
     * @private
     */
    getTextPosition(path: number[][]): 'left' | 'right' | 'center' {
        const m = this.calculateSlope(path);
        const textPosition = (path[path.length - 2][0] - path[path.length - 1][0]) < 0 ? 'left' : 'right';
        return (m > 2 || m < -2) ? 'center' : textPosition;
    }

    /*
     * calculate the slope of the last part of the given path
     * @param path
     * @returns {number}
     * @private
     */
    calculateSlope(path: number[][]): number {
        return (path[path.length - 2][1] - path[path.length - 1][1]) / (path[path.length - 2][0] - path[path.length - 1][0]);
    }

    _addLineMeasurementsToPolylines(evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent): void {
        const polylines = evt.type === 'create' ? [evt.graphic] : evt.graphics;
        polylines.forEach(polyline => this._addLineMeasurementsToPolyline(polyline, evt));
    }

    /**
     * add line measurements to a polyline
     *
     * @param evt
     * @param aborted
     * @private
     */
    _addLineMeasurementsToPolyline(graphic: Graphic, evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent) {
        // remove the graphics so they do not stack on one another
        this.layer.removeManyMeasurements([graphic], "measurement");
        const aborted = evt?.type === 'update' && evt.aborted;
        if (graphic?.getAttribute('showLineMeasurementsAtPolylines') && !aborted) {
            const polyline = graphic.geometry as Polyline;
            const spatialReference = polyline.spatialReference;
            const paths = polyline.paths[0];

            for (let i = 1; i < paths.length; i++) {
                const checkedPath = [paths[i - 1], paths[i]];
                const { angle, text, geometry } = this.calculator.createDistanceText(new Polyline({ paths: [checkedPath], spatialReference }));

                if (!geometry) {
                    return;
                }

                const temporary = evt?.type === 'create' && evt.toolEventInfo.type === 'cursor-update';
                this.layer.addMeasurement(geometry, graphic, { text, angle, temporary }, 'measurement');
            }
        }
    }

    /**
     * add angle texts to polyline
     *
     * @param evt
     * @param aborted
     * @private
     */
    private async _addAngleMeasurementForPolylines(evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent): Promise<void> {
        // remove the graphics so they do not stack on one another
        const polylines = evt.type === "create" ? [evt.graphic] : evt.graphics;
        return Promise.all(polylines.map(polyline => this._addAngleMeasurementForPolyline(polyline, evt))).then(() => { });
    }

    private async _addAngleMeasurementForPolyline(graphic: Graphic, evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent): Promise<void> {
        const aborted = evt?.type === 'update' && evt.aborted;
        this.layer.removeManyMeasurements([graphic], "angle");

        const geometryToTransform = graphic.geometry as Polyline;
        const spatialReference = geometryToTransform.spatialReference;

        const show = graphic.getAttribute("showAngleMeasurementsAtPolylines");
        if (show && !aborted) {
            const transformedGeometry = await this.calculator.transformGeom(geometryToTransform, 3857);
            const paths = transformedGeometry.paths[0];
            if (paths.length >= 3) {
                for (let i = 2; i < paths.length; i++) {
                    const p2 = this.createPointFromCoordinates(paths[i]);
                    const p1 = this.createPointFromCoordinates(paths[i - 1]);
                    const p3 = this.createPointFromCoordinates(paths[i - 2]);

                    const orgPath = geometryToTransform.paths[0];
                    const pointCoordinates = orgPath[i - 1];
                    const point = new Point({
                        spatialReference,
                        x: pointCoordinates[0],
                        y: pointCoordinates[1]
                    });

                    const angleGraphic = this.createAngleTextCursorUpdate(p1, p2, p3, point);
                    const temporary = evt?.type === 'create' && evt.toolEventInfo.type === 'cursor-update';

                    this.layer.addMeasurement(angleGraphic.point, graphic, { text: angleGraphic.text, temporary }, 'angle');
                }
            }
        }
    }

    private createPointFromCoordinates([x, y]: number[]): Point {
        return new Point({ x, y });
    }

    /*
     * create text symbol with line length on cursor moves
     * @param checkedPath: path consisting of to points which define the line
     * @param id: uid of the sketched polygon
     */
    createAngleTextCursorUpdate(p1: Point, p2: Point, p3: Point, anglePoint: Point): { text: string, point: Point } {
        const calculator = this.angleCalculator;
        calculator.setData(p1, p2, p3, anglePoint);
        const angleText = calculator.getAngleWithUnit();

        return { text: angleText, point: calculator.getPoint() };
    }
}
