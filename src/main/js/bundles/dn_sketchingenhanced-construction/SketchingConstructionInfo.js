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
/*** SKIP-SONARQUBE-ANALYSIS ***/
/*
 * Copyright (C) con terra GmbH
 */

import Polyline from "esri/geometry/Polyline";
import {planarArea, planarLength, geodesicArea, geodesicLength} from "esri/geometry/geometryEngine";
import {declare} from "apprt-core/Mutable";

const pi = Math.PI;
const r2d = 180.0 / pi;

const calcAngleDegree360 = (x, y) => {
    let a = Math.atan2(y, x);
    a < 0 && (a += pi + pi);
    return a * r2d;
};

export default declare({
    //injected
    _constructionModel: null,

    //local
    _constructionInfo: {},
    _constructionInfo0: {},

    activate() {
        this._constructionInfo0 = this._createConstructionInfo();
    },

    handler(evt) {
        const viewModel = this._sketchingHandler.sketchViewModel;
        const tool = viewModel.tool;
        const tools = this._getOption("tools", false, []);
        if (tool && tool.id && tools.includes(tool.id) && evt.type === "create" && evt.state === "active") {
            const graphic = evt.graphics && evt.graphics[0] || evt.graphic;
            graphic && graphic.geometry && (this._constructionInfo = this._getConstructionInfo(viewModel, graphic));
        } else {
            this._constructionInfo = this._constructionInfo0;
        }
    },

    _getOption(prop, checkUse = true, invalidValue = undefined) {
        return this._constructionModel._getOption(prop, checkUse, invalidValue);
    },

    _getConstructionInfo(viewModel, graphic) {
        const geo = graphic.geometry;
        const srs = graphic.geometry.spatialReference;
        const isGeodesic = srs.isWebMercator || srs.isWGS84;
        let area;
        if (isGeodesic && geo.type !== "polygon") {
            area = this._toFixed(geodesicArea(geo,'square-meters')) + "qm";
        } else if (!isGeodesic && geo.type !== "polygon") {
            area = this._toFixed(planarArea(geo,'square-meters')) + "qm"
        } else {
            area = "";
        }

        const lengthTotal = isGeodesic ? this._toFixed(geodesicLength(geo,'meters')) + "m" : this._toFixed(planarLength(geo,'meters')) + "m";
        let length = "";
        let angle = "";
        let angleRelative = "";

        const view = viewModel.view;
        const activeAction = viewModel._operationHandle && viewModel._operationHandle.activeComponent && viewModel._operationHandle.activeComponent.activeAction;
        const vertices = activeAction && activeAction.vertices;
        const points = this._getLastPointsRef(vertices);
        if (points) {
            const p0 = points.p0;
            const p1 = points.p1;
            const p2 = points.p2;
            const polyline = new Polyline({
                paths: [[p1, p2]],
                spatialReference: view.spatialReference
            });

            let a = calcAngleDegree360(p2[0] - p1[0], p2[1] - p1[1]);
            let aRelative = a - calcAngleDegree360(p1[0] - p0[0], p1[1] - p0[1]);
            aRelative >= 0 || (aRelative = (aRelative + 360) % 360);

            angle = this._toFixed(a) + "°";
            angleRelative = this._toFixed(aRelative) + "°";
            length = isGeodesic ? this._toFixed(geodesicLength(polyline)) + "m" : this._toFixed(planarLength(polyline)) + "m";
        }
        return this._createConstructionInfo(angle, angleRelative, length, lengthTotal, area);
    },

    _createConstructionInfo(angle, angleRelative, planarLength, planarLengthTotal, area) {
        return {
            angle: angle,
            angleRelative: angleRelative,
            planarLength: planarLength,
            planarLengthTotal: planarLengthTotal,
            area: area
        };
    },

    _toFixed(value) {
        let str = "" + value;
        if (str.includes(".")) {
            const commaPlace = this._getOption("commaPlace", false, 2);
            const patt = new RegExp("\.0{" + commaPlace + "}");
            str = value.toFixed(commaPlace);
            patt.test(str) && (str = str.substr(0, str.indexOf(".")));
        }

        return str;
    },

    _getLastPointsRef(vertices) {
        let p0 = null;
        let p1 = null;
        let p2 = null;
        const size = vertices.length;
        if (size > 1) {
            p2 = vertices[size - 1];
            p1 = vertices[size - 2];
            p0 = size > 2 ? vertices[size - 3] : p1;
        }

        return p1 && {p0: p0, p1: p1, p2: p2};
    }
})
