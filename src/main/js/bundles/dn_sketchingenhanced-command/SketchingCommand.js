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

import {buffer, union, intersect, difference} from "esri/geometry/geometryEngine";

export default function () {
    return {
        //injected
        _sketchingHandler: null,
        selectedSymbol: null,

        _getSketchViewModel() {
            return this._sketchingHandler._getSketchViewModel();
        },

        removeAll() {
            const viewModel = this._getSketchViewModel();
            // save active tool for later
            const tool = viewModel.tool;
            viewModel && this._remove(viewModel.layer.graphics.toArray());

            // use saved tool for reactivation after removing all objects from map
            const target = viewModel;
            target.tool = tool;
            viewModel.emit("update", {
                graphics: [],
                target,
                state: 'complete',
                type: 'create',
            });
        },

        removeSelected() {
            const viewModel = this._getSketchViewModel();
            viewModel && viewModel.state === "active" && this._remove(viewModel.updateGraphics.toArray());
        },

        _remove(graphics) {
            if (graphics.length) {
                const viewModel = this._getSketchViewModel();
                const selectedGraphics = viewModel._getSelectedGraphics();
                const gs = graphics.filter(graphic => {
                    return !selectedGraphics.some(selectedGraphic => {
                        return graphic.uid === selectedGraphic.uid;
                    });
                });

                viewModel.reset();
                viewModel.layer.removeMany(gs);

                // const allGraphics = viewModel.layer.graphics.toArray();
                // viewModel._setSelectedGraphics(viewModel._selectedGraphics.filter(selectedGraphic => {
                //     return allGraphics.some(graphic => {
                //         return graphic.uid === selectedGraphic.uid;
                //     });
                // }));
                //
                viewModel.emit("remove", {
                    graphics: gs,
                    state: "complete",
                    type: "remove"
                });
            }
        },

        copySelected() {
            const geometries = this._getSelectedGeometries();
            const symbol = this.selectedSymbol;
            if (geometries) {
                const sketchingHandler = this._sketchingHandler;
                const graphics = geometries.map(geometry => {
                    return sketchingHandler._addGraphic(geometry.clone(), null, symbol);
                });
                this._resetAndUpdate(graphics);
            }
        },

        bufferSelected() {
            const geometries = this._getSelectedGeometries();
            if (geometries) {
                const sketchingHandler = this._sketchingHandler;
                const viewModel = this._getSketchViewModel();
                const distance = viewModel.bufferDistance;
                const unit = viewModel.bufferUnit;
                const graphics = geometries.map((geometry) => {
                    return sketchingHandler._addGraphic(buffer(geometry, distance, unit));
                });
                this._resetAndUpdate(graphics);
            }
        },

        unionSelected() {
            const geometries = this._getSelectedGeometries();
            geometries && this._resetAndAddAndUpdate(union(geometries));
        },

        intersectSelected() {
            const geometries = this._getSelectedGeometries();
            geometries && geometries.length > 1 && this._resetAndAddAndUpdate(intersect(geometries[0], geometries[1]));
        },

        differenceSelected() {
            const geometries = this._getSelectedGeometries();
            geometries && geometries.length > 1 && this._resetAndAddAndUpdate(difference(geometries[0], geometries[1]));
        },

        addGraphic(evt) {
            const type = evt.getProperty("type");
            const features = evt.getProperty("features") || evt.getProperty("graphics");
            let geometry = evt.getProperty("geometry") || features && this._selectGeometry(features);
            geometry && (geometry = this._getGeometry(geometry, type));
            geometry && this._resetAndAddAndUpdate(geometry);
        },

        _getGeometry(geometry, operator, selectedGeometries) {
            const viewModel = this._getSketchViewModel();
            if (operator === "selectBuffer") {
                const distance = viewModel.bufferDistance;
                const unit = viewModel.bufferUnit;
                return buffer(geometry, distance, unit);
            } else if (operator === "selectCopy")
                return geometry.clone();
            else if (operator === "selectPlus" || operator === "selectMinus" || operator === "selectIntersect") {
                const geometries = selectedGeometries || this._getSelectedGeometries();
                if (geometries) {
                    this.removeSelected();
                    switch (operator) {
                        case "selectPlus":
                            return union(geometries.concat([geometry]));
                        case "selectMinus":
                            return difference(union(geometries), geometry);
                        case "selectIntersect":
                            return intersect(union(geometries), geometry);
                        default:
                            return null;
                    }
                } else {
                    return operator === "selectPlus" ? geometry.clone() : null;
                }
            } else
                return geometry;
        },

        _selectGeometry(features) {
            return features && features.length && features[0].geometry;
        },

        _getSelectedGeometries() {
            const viewModel = this._getSketchViewModel();
            return viewModel.updateGraphics.length && viewModel.updateGraphics.toArray().map((graphic) => {
                return graphic.geometry;
            });
        },

        _resetAndUpdate(graphics) {
            const sketchingHandler = this._sketchingHandler;
            sketchingHandler._reset();
            sketchingHandler._update(graphics, true);
        },

        _addAndUpdate(geometry) {
            if (geometry) {
                const sketchingHandler = this._sketchingHandler;
                sketchingHandler._update([sketchingHandler._addGraphic(geometry)], true);
            }
        },

        _resetAndAddAndUpdate(geometry) {
            const sketchingHandler = this._sketchingHandler;
            sketchingHandler._reset();
            if (geometry) {
                sketchingHandler._update([sketchingHandler._addGraphic(geometry)], true);
            }
        }
    };
}


