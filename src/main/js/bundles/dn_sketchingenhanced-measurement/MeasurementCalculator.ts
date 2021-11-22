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
        const locale = this.i18n.locale;
        if (unit !== 'auto') {
            return `${this.getAreaNumeric(geometry, unit).toLocaleString(this.i18n.locale)} ${this.getUnitAbbreviation(unit)}`;
        } else {
            const squareMeters = this.getAreaNumeric(geometry, 'square-meters');
            const useKms = squareMeters > 1000000;
            if (useKms) {
                const places = this.settings.kmDecimal;
                const area = this.getAreaNumeric(geometry, 'square-kilometers').toFixed(places || 2);
                return `${parseFloat(area).toLocaleString(locale)} km²`
            } else {
                const places = this.settings.mDecimal;
                const area = squareMeters.toFixed(places || 2);
                return `${parseFloat(area).toLocaleString(locale)} m²`;
            }
        }
    }

    /*
     * get Area of given geometry in meters squared
     */
    public getAreaNumeric(geometry: Polygon, unit: __esri.ArealUnits | 'auto'): number {
        if (unit === 'auto') unit = null as __esri.ArealUnits;
        let area = (this.getMapArea(geometry, unit || 'square-meters') * Math.pow(10, this.settings.mDecimal)) / Math.pow(10, this.settings.mDecimal);
        return +area;
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
        if (unit !== 'auto') {
            return `${area.toLocaleString(this.i18n.locale)} ${this.getUnitAbbreviation(unit)}`;
        } else {
            return area > 1000000 ?
                `${(Math.round((area / 1000000) * Math.pow(10, this.settings.kmDecimal)) / Math.pow(10, this.settings.kmDecimal)).toLocaleString(this.i18n.locale)} km²` :
                `${area.toLocaleString(this.i18n.locale)} m²`;
        }
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
        const locale = this.i18n.locale;
        if (unit !== 'auto') {
            return `${this.getLengthNumeric(geometry, unit).toLocaleString(this.i18n.locale)} ${this.getUnitAbbreviation(unit)}`
        } else {
            let meters = this.getLengthNumeric(geometry, 'meters');
            const useKms = meters > 1000;
            if (useKms) {
                const places = this.settings.decimalPlacesKiloMeter;
                let segment = this.getLengthNumeric(geometry, 'kilometers');
                let length = segment.toFixed(places || 2)
                return `${parseFloat(length).toLocaleString(locale)} km`;
            } else {
                const places = this.settings.decimalPlacesMeter || 2;
                let segment = meters;
                let length = segment.toFixed(places || 2)
                return `${parseFloat(length).toLocaleString(locale)} m`;
            }
        }
    }

    /**
     * get Length of given geometry
     */
    public getLengthString(length: number, unit: __esri.LinearUnits | 'auto'): string {
        if (unit !== 'auto') {
            return `${length.toLocaleString(this.i18n.locale)} ${this.getUnitAbbreviation(unit)}`;
        } else {
            return length > 1000 ? `${((length / 1000) * Math.pow(10, this.settings.kmDecimal) / Math.pow(10, this.settings.kmDecimal)).toLocaleString(this.i18n.locale)} km` :
                `${length.toLocaleString(this.i18n.locale)} m`
        }
    }

    /*
     * get Length of given geometry in meters
     */
    protected getLengthNumeric(geometry: Polygon, unit: __esri.LinearUnits | 'auto'): number {
        if (unit === 'auto') unit = null as __esri.LinearUnits;
        const length = (this.getMapLength(geometry, unit || 'meters') * Math.pow(10, this.settings.mDecimal)) / Math.pow(10, this.settings.mDecimal);
        return +length;
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