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

import type Polygon from "esri/geometry/Polygon";
import type CoordinateTransformer from "@conterra/ct-mapapps-typings/coordinatetransformer/CoordinateTransformer";
import * as geoEngine from 'esri/geometry/geometryEngine';
import type { Polyline, Point } from "esri/geometry";


type AutoUnit = 'auto';

interface SpatialReferenceTransformationSetting {
    systemWkid: number,
    transform: string,
}

export interface MeasurementCalculatorSettings {
    kmDecimal: number;
    mDecimal: number;
    unitAbbreviationMapping?: object;
    areaUnit: __esri.ArealUnits | AutoUnit;
    lengthUnit: __esri.LinearUnits | AutoUnit;
    srsDefinition: { geodesic: number[] },
    pointCoordPlaces?: number;
    systemsWithUnits?: string[];
    pointCoordUnitSymbolY: string;
    pointCoordUnitSymbolX: string;
    srs?: SpatialReferenceTransformationSetting
}

export class MeasurementCalculator {
    i18n: { locale: string };
    settings: MeasurementCalculatorSettings;
    coordinateTransformer: CoordinateTransformer;

    constructor(settings: MeasurementCalculatorSettings, coordinateTransformer: CoordinateTransformer, i18n: { locale: string }) {
        this.settings = settings;
        this.i18n = i18n;
        this.coordinateTransformer = coordinateTransformer;
    }

    /**
     * get Area of given geometry
     */
    public getArea(geometry: Polygon, unit: __esri.ArealUnits | 'auto' = this.settings?.areaUnit): string {
        const unitForCalculation = unit === 'auto' ? 'square-meters' : unit;
        return this.getAreaString(this.getMapArea(geometry, unitForCalculation), unit);
    }

    /*
     * calculates the map area depending on the spatial reference system
     */
    protected getMapArea(geometry: Polygon, unit: __esri.ArealUnits): number {
        if (this.shouldCalculateGeodesic(geometry.spatialReference.wkid)) {
            return geoEngine.geodesicArea(geometry, unit);
        }

        return geoEngine.planarArea(geometry, unit);
    }

    protected shouldCalculateGeodesic(wkid: number): boolean {
        return this.settings?.srsDefinition?.geodesic?.some(x => x === wkid);
    }

    /**
     * get Area of given geometry
     */
    protected getAreaString(area: number, unit: __esri.ArealUnits | 'auto'): string {
        const { area: calculatedArea, unit: calculatedUnit } = this.getCalculatedAreaAndUnit(area, unit);
        if (Math.abs(area) === 0) {
            return null;
        }
        return this.formatValue(calculatedArea, calculatedUnit);
    }

    protected getCalculatedAreaAndUnit(area: number, unit: __esri.ArealUnits | 'auto'): { area: number, unit: __esri.ArealUnits } {
        if (unit !== 'auto') {
            // fixed unit
            return { area, unit };
        }
        // automatic recalculation of area
        if (area > 1000000) {
            // calculate square-kilometers
            return { area: area / 1000000, unit: 'square-kilometers' };
        }
        return { area: area, unit: 'square-meters' };
    }

    protected formatValue(value: number, unit: __esri.Unit): string {
        const digits = this.getDigitForUnit(unit);
        const formattedValue = value.toLocaleString(this.i18n.locale, { maximumFractionDigits: digits });

        return `${formattedValue} ${this.getUnitAbbreviation(unit)}`;
    }

    protected getDigitForUnit(unit: __esri.Unit): number {
        const map = new Map<__esri.Unit, number>();
        map.set('square-meters', this.settings.mDecimal);
        map.set('meters', this.settings.mDecimal);
        map.set('square-kilometers', this.settings.kmDecimal);
        map.set('kilometers', this.settings.kmDecimal);

        return map.get(unit) || 3;
    }

    /**
     * Returns the abbreviation of the given unit
     */
    protected getUnitAbbreviation(unit: __esri.Unit): string {
        const mapping = this.settings.unitAbbreviationMapping;
        return mapping?.[unit];
    }

    /**
     * get Length of given geometry
     */
    public getLength(geometry: Polygon | Polyline, unit: __esri.LinearUnits | 'auto' = this.settings?.lengthUnit): string {
        const unitForCalculation = unit === 'auto' ? 'meters' : unit;
        return this.getLengthString(this.getMapLength(geometry, unitForCalculation), unit);
    }

    protected getCalculatedLengthAndUnit(length: number, unit: __esri.LinearUnits | 'auto'): { length: number, unit: __esri.LinearUnits } {
        if (unit !== 'auto') {
            // fixed unit
            return { length, unit };
        }
        // automatic recalculation of length
        if (length > 1000) {
            // calculate kilometers
            return { length: length / 1000, unit: 'kilometers' };
        }
        return { length: length, unit: 'meters' };
    }

    /**
     * get Length of given geometry
     */
    private getLengthString(length: number, unit: __esri.LinearUnits | 'auto'): string {
        const { length: calculatedLength, unit: calculatedUnit } = this.getCalculatedLengthAndUnit(length, unit);
        if (length === 0) {
            return null;
        }
        return this.formatValue(calculatedLength, calculatedUnit);
    }

    /**
     * calculates the linear map length depending on the spatial reference system
     */
    protected getMapLength(geometry: Polygon | Polyline, unit: __esri.LinearUnits): number {
        if (this.shouldCalculateGeodesic(geometry.spatialReference.wkid)) {
            return geoEngine.geodesicLength(geometry, unit);
        }

        return geoEngine.planarLength(geometry, unit);
    }

    public createDistanceText(line: Polyline): { angle: number, geometry: Point, text: string } {
        const unit = this.settings?.lengthUnit || 'auto';
        const lengthString = this.getLength(line, unit);
        const checkedPath = line.paths[0];
        if (!checkedPath) {
            return null;
        }

        // calculate rotation angle for text
        const angle = -180 / Math.PI * Math.atan((checkedPath[1][1] - checkedPath[0][1]) / (checkedPath[1][0] - checkedPath[0][0]));
        const pnt = line.extent.center;

        return { angle, geometry: pnt, text: lengthString };
    }

    /**
    * converts the point graphic into a readable string (asyncronous)
    * @return corrdinate string
    * @param evt
    * @private
    */
    public async getPointString(geometry: Point): Promise<string> {
        if (!geometry) {
            return '';
        }

        const srs = geometry.spatialReference.wkid;
        const targetSrs = this.settings.srs?.systemWkid || srs;
        const places = this.settings.pointCoordPlaces || 2;
        const unitSymbolX = this.settings.systemsWithUnits?.includes(targetSrs.toString()) ? this.settings.pointCoordUnitSymbolX : '';
        const unitSymbolY = this.settings.systemsWithUnits?.includes(targetSrs.toString()) ? this.settings.pointCoordUnitSymbolY : '';
        const transformedPoint = await this.transformGeom(geometry, targetSrs);

        if (!transformedPoint) {
            return null;
        }
        let x = transformedPoint.x.toFixed(places);
        let y = transformedPoint.y.toFixed(places);
        if (this.settings.srs?.transform === 'dms') {
            const newX = this._toDMS(x, unitSymbolX.length > 1 ? unitSymbolX[1] : unitSymbolX);
            const newY = this._toDMS(y, unitSymbolY.length > 1 ? unitSymbolY[1] : unitSymbolY);
            return (newX + " / " + newY);
        }
        return (x + unitSymbolX + " / " + y + unitSymbolY);
    }


    /**
     * transform the point into a the desired srs
     * @return {Promise<string>} coordinate
     * @param geom, targetSrs
     * @private
     */
    public async transformGeom<T>(geom: T, targetSrs: number): Promise<T> {
        return this.coordinateTransformer?.transform(geom, targetSrs);
    }

    /**
     * converts decimal degrees to degree/minutes/seconds
     * @param input: coordinate in decimal degree (wgs84)
     * @param unitSymbol: (N,E,S,W)
     * @returns {string}
     * @private
     */
    private _toDMS(input: string, unitSymbol: string): string {
        const coordinate = Math.abs(parseFloat(input));
        const degree = Math.floor(coordinate);
        const decimalMinutes = coordinate - degree;
        const degreeMinutes = decimalMinutes * 60;
        const minutes = Math.floor(degreeMinutes);
        const decimalSeconds = degreeMinutes - minutes;
        const degreeSeconds = decimalSeconds * 60;
        const seconds = Math.floor(degreeSeconds);
        return `${degree}° ${minutes}' ${seconds}'' ${unitSymbol}`;
    }
}