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
import type Highlighter from "@conterra/ct-mapapps-typings/highlights/Highlighter";
import type SketchViewModel from "esri/widgets/Sketch/SketchViewModel";
import Observers from 'apprt-core/Observers';
import TopicEvent from 'apprt/event/Event';
import Polyline from "esri/geometry/Polyline";
import type Polygon from "esri/geometry/Polygon";


export default class SelectionHighlighter {

    private highlighted = [];
    private observers = Observers();

    public sketchingHandler: { sketchViewModel: SketchViewModel };
    public highlighter: Highlighter;
    public snappingConfig: any;
    public _properties: { toolId: string };


    public activate() {
        // set viewModel if SketchingHandler was started before this component
        const viewModel = this.sketchingHandler?.sketchViewModel;
        this.setSketchViewModel(new TopicEvent('must_not_be_empty', { viewModel }));
    }

    /*
     * ct.framework.api.EventHandler
     */
    public setSketchViewModel(evt: TopicEvent): void {
        const viewModel = evt.getProperty('viewModel');
        if (!viewModel) {
            return;
        }

        viewModel.on('activateTool', (tool: string) => {
            if (tool === this._properties.toolId) {
                return this.startHighlighting();
            }
            this.stopHighlighting();
        });

        viewModel.on('deactivateTool', (tool: string) => {
            if (tool === this._properties.toolId) {
                this.stopHighlighting();
            }
        });
    }

    startHighlighting() {
        const viewModel = this.sketchingHandler.sketchViewModel;
        const pointerMoveHandler = viewModel.view.on('pointer-move', event => {
            this.removeHighlights();
            // only include graphics from sketchinglayer in the hitTest
            const opts = {
                include: viewModel.layer
            }
            viewModel.view.hitTest(event, opts).then((response) => {
                // check if a feature is returned from the sketchinglayer
                if (response.results.length) {
                    const graphic = response.results[0].graphic;
                    const outline = new Polyline({
                        paths: (graphic.geometry as Polygon).rings,
                        spatialReference: graphic.geometry.spatialReference,
                    });

                    // do something with the graphic
                    const highlight = this.highlighter?.highlight({
                        geometry: outline,
                        symbol: this.snappingConfig._getSymbol(outline),
                    });
                    this.highlighted.push(highlight);
                }
            });
        });

        this.observers.add(pointerMoveHandler);
    }

    stopHighlighting() {
        this.removeHighlights();
        this.observers.clean();
    }

    private removeHighlights(): void {
        this.highlighted.forEach(h => h?.remove());
    }
}