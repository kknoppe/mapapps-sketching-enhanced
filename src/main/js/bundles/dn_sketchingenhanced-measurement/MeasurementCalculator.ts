/*
 * Copyright (C) 2021 con terra GmbH (info@conterra.de)
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
import type SpatialReference from "esri/geometry/SpatialReference";
import * as geoEngine from 'esri/geometry/geometryEngine';
import Polygon from "esri/geometry/Polygon";

export interface MeasurementCalculatorSettings {
    spatialReference: SpatialReference;
    kmDecimal: number;
    mDecimal: number;
    decimalPlacesKiloMeter: number;
    decimalPlacesMeter: number;
    unitAbbreviationMapping: object;
}

export class MeasurementCalculator {

    i18n: { locale: string };
    settings: MeasurementCalculatorSettings;

    constructor(settings: MeasurementCalculatorSettings, i18n: { locale: string }) {
        this.settings = settings;
        this.i18n = i18n;
    }

    /**
     * get Area of given geometry
     */
    public getArea(geometry: Polygon, unit: __esri.ArealUnits | 'auto'): string {
        const unitForCalculation = unit === 'auto' ? 'square-meters' : unit;
        return this.getAreaString(this.getMapArea(geometry, unitForCalculation), unit);
    }

    /*
     * calculates the map area depending on the spatial reference system
     */
    protected getMapArea(geometry: Polygon, unit: __esri.ArealUnits): number {
        const srs = this.settings.spatialReference;
        if (srs.isWebMercator || srs.isWGS84) {
            return geoEngine.geodesicArea(geometry, unit);
        } else {
            return geoEngine.planarArea(geometry, unit);
        }
    }

    /**
     * get Area of given geometry
     */
    public getAreaString(area: number, unit: __esri.ArealUnits | 'auto'): string {
        const { area: calculatedArea, unit: calculatedUnit } = this.getCalculatedAreaAndUnit(area, unit);
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
    public getLength(geometry: Polygon, unit: __esri.LinearUnits | 'auto'): string {
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
    public getLengthString(length: number, unit: __esri.LinearUnits | 'auto'): string {
        const { length: calculatedLength, unit: calculatedUnit } = this.getCalculatedLengthAndUnit(length, unit);
        return this.formatValue(calculatedLength, calculatedUnit);
    }

    /**
     * calculates the linear map length depending on the spatial reference system
     */
    protected getMapLength(geometry: Polygon, unit: __esri.LinearUnits): number {
        const srs = this.settings.spatialReference;
        if (srs.isWebMercator || srs.isWGS84) {
            return geoEngine.geodesicLength(geometry, unit);
        } else {
            return geoEngine.planarLength(geometry, unit);
        }
    }
}