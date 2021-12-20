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

import type { MeasurementLayer } from "dn_sketchingenhanced-measurement/MeasurementLayer";
import type Graphic from "esri/Graphic";
import type { MeasurementAction, MeasurementUpdateEvent } from "./MeasurementAction";
import type { MeasurementCalculator } from "dn_sketchingenhanced-measurement/MeasurementCalculator";
import type { MeasurementLabelProvider } from "dn_sketchingenhanced-measurement/labels/MeasurementLabelProvider";
import type { Polygon } from "esri/geometry";
import { Point, Polyline } from "esri/geometry";
import { getTemporaryState } from "./MeasurementActionUtils";

export default class PolygonMeasurementAction implements MeasurementAction {

    public actionType = 'polygon';
    private layer: MeasurementLayer;
    private calculator: MeasurementCalculator;
    private _lastVertex: number[];
    private labelProvider: MeasurementLabelProvider;

    constructor(layer: MeasurementLayer, calculator: MeasurementCalculator, labelProvider: MeasurementLabelProvider) {
        this.labelProvider = labelProvider;
        this.layer = layer;
        this.calculator = calculator;
    }

    deleteMeasurements(evt: __esri.SketchViewModelDeleteEvent): void {
        this.removeTextGraphicsById(evt?.graphics);
        this._removeAreaGraphicsById(evt?.graphics);
    }

    _getMeasurements(evt: __esri.SketchViewModelCreateEvent): void {
        this.saveVertex(evt);
        this.addMeasurementToPolygonLines(evt.graphic, evt?.toolEventInfo?.type === "cursor-update");
        this._calculateCircumferenceAndArea(evt);
    }

    public _updateMeasurements(evt: MeasurementUpdateEvent): void {
        evt.graphics.forEach(g => this.addMeasurementToPolygonLines(g, false));
        this._calculateCircumferenceAndArea(evt);
    }

    private shouldAddLineMeasurementToGraphic(graphic: Graphic): boolean {
        return graphic.getAttribute('showLineMeasurementsAtPolygons');
    }

    /*
     * create and add text graphic to the measurement layer with information about line length
     * @param evt
     * @param firstPoint: only necessary for the first line element
     * @param id: uid of sketched polygon to be able to delete temporary length information on completion
     * @private
     */
    private saveVertex(evt: __esri.SketchViewModelCreateEvent): void {
        if (evt?.toolEventInfo?.type !== 'vertex-add') {
            return;
        }
        const newVertex = (evt.toolEventInfo as __esri.VertexAddEventInfo).added;
        this._lastVertex = newVertex;
    }

    /*
     * calculate circumference and area of circles and ellipsis
     * @param geometry
     * @param temporary Boolean parameter which is true if text should be deleted on next cursor move
     * @param horizontalAlignment
     * @private
     */
    private _calculateCircumferenceAndArea(evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent) {
        const eventType = evt?.type;
        if (eventType === 'create') {
            return this._calculateCircumferenceAndAreaOfPolygon(evt.graphic, evt);
        }
        if (eventType === 'redo' || eventType === 'undo' || eventType === 'update') {
            return this._calculateCircumferenceAndAreaOfPolygons(evt.graphics, evt);
        }
    }

    private _calculateCircumferenceAndAreaOfPolygons(graphics: Graphic[], evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent): void {
        graphics?.forEach(g => this._calculateCircumferenceAndAreaOfPolygon(g, evt));
    }

    private _calculateCircumferenceAndAreaOfPolygon(graphic: Graphic, evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent): void {
        const polygon = graphic?.geometry as Polygon;
        if (polygon?.type !== 'polygon') {
            return;
        }

        this._removeAreaGraphicsById([graphic]);

        const symbolProperties = this.getSymbolPropertiesForCircumferenceAndArea(polygon, evt);
        if (!symbolProperties?.text) {
            // nothing to show
            return;
        }

        const pnt = evt.type === "create" && evt.state !== 'complete' ? this.getCoordinates(evt) : this.getCenterOfPolygon(polygon);

        this.layer.addMeasurement(pnt, graphic, symbolProperties, "areaText");
    }

    private getSymbolPropertiesForCircumferenceAndArea(polygon: Polygon, evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent): __esri.TextSymbolProperties & { temporary?: boolean } {
        const circumference = this.calculator.getLength(polygon);
        const area = this.calculator.getArea(polygon);

        if (!circumference || !area) {
            // do not show zero values
            return null;
        }

        const text = this.getCircumferenceAndAreaText(area, circumference);
        const horizontalAlignment = this.getTextPositionForPointLabel(evt);
        const xoffset = horizontalAlignment === 'left' ? 20 : horizontalAlignment === 'right' ? -20 : 0;
        const temporary = getTemporaryState(evt);

        return { text, horizontalAlignment, xoffset, temporary };
    }

    private getTextPositionForPointLabel(evt: __esri.SketchViewModelCreateEvent | MeasurementUpdateEvent): 'left' | 'right' | 'center' {
        if (evt.type === 'undo' || evt.type === 'redo' || evt.type === 'update') {
            // do not show measurement text at cursor position
            return 'center';
        }
        if (evt.state === 'complete') {
            // show measurement text at center of polygon after sketch is completed
            return 'center';
        }

        return (this._lastVertex && this.getCoordinatesFromEvent(evt)?.[0] - this._lastVertex[0] > 0) ? 'left' : 'right';
    }

    private getCircumferenceAndAreaText(area: string, circumference: string): string {
        const areaLabel = this.labelProvider?.getLabel('area');
        const circumferenceLabel = this.labelProvider?.getLabel('circumference');

        return `${areaLabel}: ${area} \n ${circumferenceLabel}: ${circumference}`;
    }

    /*
     * gets and returns the coordinates of the drawn object
     * @param evt
     * @private
     */
    private getCoordinates(evt: __esri.SketchViewModelCreateEvent): Point {
        const coordinates = this.getCoordinatesFromEvent(evt);
        if (!coordinates) {
            return;
        }

        return new Point({ x: coordinates[0], y: coordinates[1], spatialReference: evt.graphic.geometry.spatialReference });
    }

    private getCoordinatesFromEvent(evt: __esri.SketchViewModelCreateEvent): number[] {
        if (evt?.toolEventInfo?.type === 'cursor-update') {
            return evt.toolEventInfo.coordinates;
        }
        if (evt?.toolEventInfo?.type === 'vertex-add') {
            return evt.toolEventInfo.added;
        }

        return null;
    }


    private getCenterOfPolygon(g: Polygon): Point {
        return g?.extent?.center;
    }

    private _removeAreaGraphicsById(referenceGraphics: Graphic[]): void {
        this.layer.removeManyMeasurements(referenceGraphics, "areaText");
    }

    private addMeasurementToPolygonLines(graphic: Graphic, temporary: boolean): void {
        this.removeTextGraphicsById([graphic]);
        if (graphic.geometry.type !== 'polygon') {
            return;
        }
        const polygon = graphic.geometry as Polygon;
        if (this.shouldAddLineMeasurementToGraphic(graphic)) {
            const rings = polygon.rings;
            rings.forEach(rings => {
                for (let i = 1; i < rings.length; i++) {
                    const checkedPath = [rings[i - 1], rings[i]];
                    const { angle, text, geometry } = this.calculator.createDistanceText(new Polyline({ paths: [checkedPath], spatialReference: polygon.spatialReference })) || {};

                    if (!geometry) {
                        return;
                    }
                    this.layer.addMeasurement(geometry, graphic, { angle, text, temporary });
                }
            });
        }
    }

    private removeTextGraphicsById(referenceGraphics: Graphic[]): void {
        this.layer.removeManyMeasurements(referenceGraphics, "text");
    }
}
