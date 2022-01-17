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

import Point from "esri/geometry/Point";
import Circle from "esri/geometry/Circle";

const pi = Math.PI;
const r2d = 180.0 / pi;
const d2r = pi / 180.0;

const calcAngleDegree360 = (x, y) => {
    let a = Math.atan2(y, x);
    a < 0 && (a += pi + pi);
    return a * r2d;
};

const calcLength = (p1, p2) => {
    const dx = p1[0] - p2[0], dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
};

export default class SketchingConstruction {
    history = new ConstructionHistory();

    activate() {
        //local
        this._viewModel = null;
        this._pointerEvt = null;
        this._pointerHandler = null;
        this._useOptionHandler = null;
    }

    deactivate() {
        this._pointerHandler && this._pointerHandler.remove();
        this._useOptionHandler && this._useOptionHandler.remove();
    }

    handler(evt) {
        const type = evt.type;
        const state = evt.state;
        const viewModel = this._sketchingHandler.sketchViewModel;
        const tool = viewModel.tool;
        const tools = this._getOption("tools", false, []);
        const snappingManager = this._snappingManager;
        const radius = this._getOption("radius");

        this._setViewModel(viewModel);
        if (tool?.id && tools.includes(tool.id)) {
            // add step to history
            this.history.add(evt?.toolEventInfo?.type);
            

            if (state === "cancel" || state === "complete") {
                if (this.history.wasDoubleClick()) {
                    // remove last added vertex when sketching was completed by a double click
                    evt.graphic.geometry.paths[0].pop();
                }
                if (snappingManager && snappingManager._mandatoryWithoutSnappingMode === true) {
                    snappingManager._mandatoryWithoutSnappingMode = false;
                    snappingManager.removeSnappingGraphics();
                }
                if (tool.id === "drawcircletool" && radius) {
                    this._createCircle(radius, evt.graphic);
                }
            } else if (type === "create" && state === "active") {
                const angle = this._getOption("angle");
                const angleModulus = this._getOption("angleModulus");
                const angleTypeRelative = this._getOption("angleTypeRelative", false);
                const planarLength = this._getOption("planarLength");

                snappingManager && (snappingManager._mandatoryWithoutSnappingMode = !!(angle || angleModulus || planarLength));
                if (angle || angleModulus || planarLength) {
                    this._constructionHandler(angle, angleModulus, angleTypeRelative, planarLength, evt);
                }
            }
        }
    }

    _setViewModel(viewModel) {
        if (!this._viewModel) {
            this._viewModel = viewModel;
            this._pointerHandler = viewModel.view.on("pointer-move", (evt) => {
                this._pointerEvt = evt;
            });
        }
    }

    _getOption(prop, checkUse = true, invalidValue = undefined) {
        return this._constructionModel._getOption(prop, checkUse, invalidValue);
    }

    _isSnapAction() {
        const snappingManager = this._snappingManager;
        if (snappingManager) {
            const snapMode = snappingManager.alwaysSnap;
            const hasSnapKeyDown = false;
            return snapMode && !hasSnapKeyDown || !snapMode && hasSnapKeyDown;
        }
        return false;
    }

    _constructionHandler(angle, angleModulus, angleTypeRelative, planarLength, evt) {
        const viewModel = this._viewModel;
        const view = viewModel.view;
        const activeAction = viewModel._operationHandle && viewModel._operationHandle.activeComponent && viewModel._operationHandle.activeComponent.activeAction;
        const vertices = activeAction && activeAction.vertices;
        const points = vertices && this._getLastPointsRef(vertices);
        if (points) {
            const snapLine = (angle === undefined || planarLength === undefined) && this._getSnappingLine(points);
            const a = this._calcAngleRadians2PI(points, angle, angleModulus, angleTypeRelative);
            const p = this._calcLengthPoint(points, angle, angleModulus, planarLength, a, snapLine);

            const point = this._createGeoPoint(p[0], p[1], view.spatialReference);
            const screenPoint = view.toScreen(point);

            const pointerEvt = this._pointerEvt;
            const native = pointerEvt.native;
            if (pointerEvt.x !== screenPoint.x || pointerEvt.y !== screenPoint.y || evt?.toolEventInfo?.type === 'vertex-add') {
                activeAction._cursorScreenPoint.x = pointerEvt.x = native.clientX = screenPoint.x;
                activeAction._cursorScreenPoint.y = pointerEvt.y = native.clientY = screenPoint.y;

                activeAction._popCursorVertex();
                activeAction._updateCursor(pointerEvt.native);
            }
        }
    }

    _createCircle(radius, graphic) {
        const center = graphic.geometry.centroid;
        let geodesic = false;
        if (center.spatialReference.wkid === 3857
            || center.spatialReference.wkid === 4326
            || center.spatialReference.latestWkid === 3857
            || center.spatialReference.latestWkid === 4326) {
            geodesic = true;
        }
        graphic.geometry = new Circle({
            geodesic: geodesic,
            center: center,
            radius: radius,
            radiusUnit: "meters"
        });
    }

    _calcAngleRadians2PI(points, angle, angleModulus, angleTypeRelative) {
        const p0 = points.p0;
        const p1 = points.p1;
        const p2 = points.p2;

        let a;
        if (angle !== undefined) {
            a = !angleTypeRelative ? angle : angle + calcAngleDegree360(p1[0] - p0[0], p1[1] - p0[1]);
        } else if (angleModulus !== undefined) {
            const c = !angleTypeRelative ? 0 : calcAngleDegree360(p1[0] - p0[0], p1[1] - p0[1]);
            let b = calcAngleDegree360(p2[0] - p1[0], p2[1] - p1[1]) - c;

            b < 0 && (b += 360);
            a = angleModulus * Math.floor(0.5 + b / angleModulus) + c;
        } else {
            a = calcAngleDegree360(p2[0] - p1[0], p2[1] - p1[1]);
        }

        return (a % 360) * d2r;
    }

    _calcLengthPoint(points, angleDef, angleModulus, planarLength, angle, snapLine) {
        const p1 = points.p1;
        const p2 = points.p2;

        if (!snapLine || (angleDef === undefined && angleModulus === undefined && planarLength === undefined)) {
            planarLength !== undefined || (planarLength = calcLength(p1, p2));
        } else if ((angleDef !== undefined || angleModulus !== undefined) && planarLength !== undefined) {
        } else if (planarLength !== undefined) {
            const p = this._getIntersectionPointLineSegmentCircle(snapLine.p0, snapLine.p1, p1, planarLength);
            if (p) {
                const point = this._createGeoPoint(p[0], p[1], snapLine.objectGeometry.spatialReference);
                this._snappingManager.addSnappingGraphics(point, snapLine.objectGeometry);
                angle = calcAngleDegree360(p[0] - p1[0], p[1] - p1[1]) * d2r;
            }
        } else {
            const p22 = this._calcPoint(p1, 10000, angle);
            const p = this._getIntersectionPointLineSegmentRay(snapLine.p0, snapLine.p1, p1, p22);
            if (!p) {
                planarLength = calcLength(p1, p2);
            } else {
                const point = this._createGeoPoint(p[0], p[1], snapLine.objectGeometry.spatialReference);
                this._snappingManager.addSnappingGraphics(point, snapLine.objectGeometry);
                planarLength = calcLength(p, p1);
            }
        }

        return this._calcPoint(p1, planarLength, angle);
    }

    _calcPoint(p0, planarLength, angle) {
        return [
            p0[0] + planarLength * Math.cos(angle),
            p0[1] + planarLength * Math.sin(angle)
        ];
    }

    _createGeoPoint(x, y, spatialReference) {
        return new Point({x: x, y: y, spatialReference: spatialReference});
    }

    _getSnappingLine(points) {
        const snappingManager = this._snappingManager;
        if (snappingManager) {
            snappingManager.removeSnappingGraphics();
            if (this._isSnapAction()) {
                const point = this._createGeoPoint(points.p2[0], points.p2[1], this._viewModel.view.spatialReference);
                const nearestPoint = snappingManager.getSnappingObject(point);
                let vertexIndex = nearestPoint.vertexIndex;
                if (vertexIndex !== undefined && nearestPoint.distance !== null && nearestPoint.distance !== undefined) {
                    const snapCoordinate = nearestPoint.coordinate;
                    const objectGeometry = nearestPoint.objectGeometry;
                    if (snapCoordinate && objectGeometry.type === "polyline") {
                        const paths = nearestPoint.objectGeometry.paths;
                        let p0, p1;
                        paths.some(path => {
                            if (path.length > vertexIndex) {
                                const idx = path.length === vertexIndex + 1 ? vertexIndex - 1 : vertexIndex;
                                p0 = path[idx];
                                p1 = path[idx + 1];
                                return true;
                            } else {
                                vertexIndex -= path.length;
                                return false;
                            }
                        });

                        return p0 ? {p0, p1, objectGeometry} : null;
                    }
                }
            }
        }
    }

    _getIntersectionPointLineSegmentRay(l1, l2, r1, r2) {
        const x11 = l1[0], y11 = l1[1], x12 = l2[0], y12 = l2[1], x21 = r1[0], y21 = r1[1], x22 = r2[0], y22 = r2[1];
        const A1 = y12 - y11, B1 = x11 - x12, C1 = A1 * x11 + B1 * y11;
        const A2 = y22 - y21, B2 = x21 - x22, C2 = A2 * x21 + B2 * y21;
        const det = A1 * B2 - A2 * B1;
        if (det !== 0) {
            const x = B1 ? (B2 * C1 - B1 * C2) / det : x11;
            const y = A1 ? (A1 * C2 - A2 * C1) / det : y11;
            if (this._intersectionPointLineSegment(x, y, x11, y11, x12, y12))
                return [x, y];
        }
        return null;
    }

    _getIntersectionPointLineSegmentCircle(l1, l2, center, radius) {
        const x11 = l1[0], y11 = l1[1], x12 = l2[0], y12 = l2[1];
        const baX = x12 - x11, baY = y12 - y11;
        const caX = center[0] - x11, caY = center[1] - y11;

        const a = baX * baX + baY * baY;
        const bBy2 = baX * caX + baY * caY;
        const c = caX * caX + caY * caY - radius * radius;

        const pBy2 = bBy2 / a;
        const q = c / a;

        let p1, p2;
        const disc = pBy2 * pBy2 - q;
        if (disc >= 0) {
            const tmpSqrt = Math.sqrt(disc);
            const abScalingFactor1 = -pBy2 + tmpSqrt;

            p1 = [x11 - baX * abScalingFactor1, y11 - baY * abScalingFactor1];
            !this._intersectionPointLineSegment(p1[0], p1[1], x11, y11, x12, y12) && (p1 = undefined);
            if (disc !== 0) {
                const abScalingFactor2 = -pBy2 - tmpSqrt;
                p2 = [x11 - baX * abScalingFactor2, y11 - baY * abScalingFactor2];
                !this._intersectionPointLineSegment(p2[0], p2[1], x11, y11, x12, y12) && (p2 = undefined);
            }

            // Here only 1 intersection is needed
            if (p1 && p2) {
                const l11 = calcLength(p1, l1), l12 = calcLength(p1, l2), l21 = calcLength(p2, l1),
                    l22 = calcLength(p2, l2);
                Math.min(l11, l12) < Math.min(l21, l22) ? (p2 = undefined) : (p1 = undefined);
            }
        }
        return p1 || p2 || null;
    }

    _intersectionPointLineSegment(x, y, x11, y11, x12, y12) {
        return x >= Math.min(x11, x12) && x <= Math.max(x11, x12)
            && y >= Math.min(y11, y12) && y <= Math.max(y11, y12);
    }

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
}

class ConstructionHistory {
    lastEvents = [];

    /**
     * Adds a history step
     * @param {string} eventName 
     */
    add(eventName) {
        this.lastEvents = this.lastEvents.slice(-8).concat([eventName]);
    }

    /**
     * Returns true, if the last action was executed by a double click
     * @returns boolean
     */
    wasDoubleClick() {
        return this.lastEvents.slice(-4, -3)[0] === 'vertex-add' && this.lastEvents.slice(-9, -8)[0] === 'vertex-add';
    }
}
