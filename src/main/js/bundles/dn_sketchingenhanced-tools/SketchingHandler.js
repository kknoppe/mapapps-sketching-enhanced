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
import SketchViewModel from "esri/widgets/Sketch/SketchViewModel";
import Graphic from "esri/Graphic";
import GraphicsLayer from "esri/layers/GraphicsLayer"
import {fromJSON} from "esri/symbols/support/jsonUtils";
import d_lang from "dojo/_base/lang"
import aspect from "dojo/aspect"
import {whenOnce} from 'esri/core/watchUtils';

export default SketchingHandler;

function SketchingHandler() {
    return {
        _topicBase: "ct/sketching/",
        _sketchUpdateHandler: null,
        _watchViewHandler: null,
        _actions: [],

        activate(context) {
            this.bundleContext = context.getBundleContext();
            const props = this._properties || {};
            this._sketchProps = props.sketch || {};
            this._graphicLayerId = props.graphicLayerId || "sketchingGraphicLayer";
            this._graphicLayerTitle = props.graphicLayerTitle || this._graphicLayerId;
            this._defaultUpdateOptions = d_lang.clone(this._sketchProps.defaultUpdateOptions || {});
            this._updateOnGraphicClick = this._sketchProps.updateOnGraphicClick;
            this.drag = null;
        },

        deactivate() {
            this._sketchUpdateHandler && this._sketchUpdateHandler.remove();
            this._watchViewHandler && this._watchViewHandler.remove();
        },

        add_action(action) {
            this._actions.push(action);
        },

        set_mapWidgetModel(mapWidgetModel) {
            this._mapWidgetModel = mapWidgetModel;
            this._watchViewHandler = mapWidgetModel.watch("view", ({value}) => {
                this.sketchViewModel ? this.sketchViewModel.set("view", value) : this._getSketchViewModel();
            });
        },

        //type: point | multipoint | polyline | polygon | rectangle | circle | transform | reshape
        //mode: hybrid - Vertices are added while the pointer is clicked or dragged. Applies to and is the default for polygon and polyline,
        //      freehand - Vertices are added while the pointer is dragged. Applies to polygon, polyline rectangle and circle. Default for rectangle and circle,
        //      click - Vertices are added when the pointer is clicked.
        //stores:
        activateTool(tool) {
            const viewModel = this._getSketchViewModel();
            viewModel.tool = tool;

            this.activeTool = tool.toolId;

            //extral actions
            this._actions.forEach(action => {
                action.setActiveToolType && action.setActiveToolType(tool.toolId);
            }, this);

            const type = tool.type || "polygon";

            const mode = tool.mode || "";
            const eventService = this._eventService;

            d_lang.mixin(viewModel.defaultUpdateOptions, this._defaultUpdateOptions, tool.updateOptions || {});
            switch (type) {
                case "point":
                case "multipoint":
                case "polyline":
                case "polygon":
                case "rectangle":
                case "circle": {
                    viewModel.create(type, {mode: mode});
                    break;
                }
                case "triangle": {
                    this._drawFurtherGeometries.createTriangle(viewModel, this._properties);
                    break;
                }
                case "ellipse": {
                    this._drawFurtherGeometries.createEllipse(viewModel, mode, this._properties);
                    break;
                }
                case "arrow": {
                    viewModel.create('polyline', {mode: mode});
                    this._drawFurtherGeometries.createArrow(viewModel, this._properties);
                    break;
                }
                case "transform":
                case "reshape": {
                    viewModel.updateOnGraphicClick = true;
                    viewModel.defaultUpdateOptions.tool = type;
                    eventService.sendEvent(this._topicBase + "MODIFY_ACTIVATE");
                    break;
                }
                case "selectPlus":
                case "selectMinus":
                case "selectIntersect":
                case "selectCopy":
                case "selectBuffer":
                case "selectReshape":
                case "selectTransform":
                case "text": {
                    viewModel.create("point", {mode: mode});
                    break;
                }
                default: {
                    break;
                }
            }
            viewModel.view.focus();

            // emit event for layer editor
            viewModel.emit('activateTool', tool?.id);
        },

        deactivateTool(tool) {
            if (tool.toolId === this.activeTool){
                this.activeTool = null;
            }
            const viewModel = this._getSketchViewModel();
            this.drag && this.drag.remove();
            if (tool && (tool.id === 'drawellipsetool' || tool.id === 'drawtriangletool')) {
                document.getElementsByClassName('esri-view-surface')[0].classList.remove('sketching-cursor');
                viewModel.tool = null;
            }
            if (viewModel) {
                // emit event for layer editor
                viewModel.emit('deactivateTool', tool?.id);
                viewModel.reset();
                viewModel.updateOnGraphicClick = this._updateOnGraphicClick;
            }
        },

        complete() {
            this._applySketchViewModelFun("complete");
        },

        cancel() {
            this._applySketchViewModelFun("cancel");
        },

        undo() {
            this._applySketchViewModelFun("undo");
        },

        redo() {
            this._applySketchViewModelFun("redo");
        },

        _applySketchViewModelFun(funName) {
            const viewModel = this._getSketchViewModel();
            const tool = funName === 'cancel' ? viewModel.tool : null;
            viewModel && viewModel[funName]();
            (viewModel && tool) && this._reactivateToolAfterCancel(viewModel, tool);
        },

        _reset() {
            const viewModel = this._getSketchViewModel();
            if (viewModel) {
                const toolP = viewModel.tool;
                const tool = toolP && toolP.tool || toolP;

                viewModel.reset();
                viewModel.tool = null;
                if (tool && tool.togglable && tool.active) {
                    tool.set("active", false);
                } else {
                    viewModel.updateOnGraphicClick = this._updateOnGraphicClick;
                }
            }
        },

        _update(graphics, toolActive, type = "reshape") {
            graphics.length > 1 && (type = "transform");
            if (this._graphicTypeIsText(graphics)){
                return;
            }
            this._getSketchViewModel().update(graphics, {tool: type});
            toolActive && this.activateTool({type: type});
        },

        _graphicTypeIsText(graphics){
            let isText = false;
            graphics.forEach(graphic => {
                if (graphic.symbol.type === "text" && graphic.symbol.flag){
                    isText = true;
                }
            });
            return isText;
        },

        _addGraphic(geometry, attributes, symbol) {
            const viewModel = this._getSketchViewModel();
            const graphic = new Graphic({
                attributes: d_lang.mixin(attributes || {}, {context: {sketching: true}}),
                geometry: geometry,
                layer: viewModel.layer,
                symbol: symbol ? symbol : this._getSymbol(geometry.type)
            });
            viewModel.layer.add(graphic);
            return graphic;
        },

        _getSymbol(geometrytype) {
            const viewModel = this._getSketchViewModel();
            return viewModel[geometrytype + "Symbol"] || viewModel.pointSymbol;
        },

        _reactivateToolAfterCancel(viewModel, tool) {
            const target = viewModel;
            target.tool = tool;
            viewModel.emit('update', {
                graphics: [],
                target,
                state: 'complete',
                type: 'create',
            });
        },

        _getSketchViewModel() {
            if (!this.sketchViewModel) {
                let props = d_lang.mixin({
                        updateOnGraphicClick: false,
                        defaultUpdateOptions: {
                            toggleToolOnClick: false
                        }
                    },
                    this._sketchProps,
                    {
                        view: this._mapWidgetModel.view,
                        layer: this._getSketchGraphicsLayer()
                    }
                );

                props.textSymbol && (props.textSymbol = fromJSON(props.textSymbol));
                props.pointSymbol && (props.pointSymbol = fromJSON(props.pointSymbol));
                props.polygonSymbol && (props.polygonSymbol = fromJSON(props.polygonSymbol));
                props.polylineSymbol && (props.polylineSymbol = fromJSON(props.polylineSymbol));

                const viewModel = this.sketchViewModel = new SketchViewModel(props);

                //extend
                viewModel._orgSymbols = null;
                aspect.before(viewModel, "_setupUpdateOperation", function (graphics, options) {
                    this._orgSymbols = graphics && graphics.map(graphic => {
                        return graphic.symbol;
                    });
                });

                viewModel._selectedGraphics = [];
                viewModel._selectedGraphicsActive = false;
                viewModel._selectedGraphicsIsObjectDivision = false;
                viewModel._objectSketchingIntersects = false;
                viewModel._setSelectedGraphics = function (selectedGraphics) {
                    this._selectedGraphics = selectedGraphics;
                };
                viewModel._getSelectedGraphics = function () {
                    return this._selectedGraphics;
                };
                viewModel.reset || (viewModel.reset = function () {
                    this.tool = null;
                    this.cancel();
                });

                //events handler
                this._sketchUpdateHandler && this._sketchUpdateHandler.remove();
                this._sketchUpdateHandler = viewModel.on(["create", "update", "remove", "reset", "undo", "redo", "delete"], d_lang.hitch(this, this._onSketchUpdateHandler));

                this._eventService.sendEvent(this._topicBase + "createSketchViewModel", {viewModel: viewModel});
            }
            return this.sketchViewModel;
        },

        _getSketchGraphicsLayer() {
            if (!this._sketchGraphicLayer) {
                const map = this._mapWidgetModel.map;
                const layerId = this._graphicLayerId;
                const layerTitle = this._graphicLayerTitle;
                this._sketchGraphicLayer = map.findLayerById(layerId);
                if (!this._sketchGraphicLayer) {
                    let layer = this._sketchGraphicLayer = new GraphicsLayer({
                        id: layerId,
                        title: layerTitle,
                        listMode: "hide",
                        spatialReference: this._mapWidgetModel.spatialReference
                    });
                    map.add(layer);
                    // this._eventService.sendEvent(this._topicBase + "setSketchGraphicsLayer", {layer: layer});

                    this.bundleContext.registerService('dn_sketchingEnhanced.Layer', {layer, order: 100}, this._graphicsLayerId);
                }
            }
            return this._sketchGraphicLayer;
        },

        async _onSketchUpdateHandler(evt) {
            if (this.activeTool){
                evt.activeTool = this.activeTool;
            }

            //extral actions
            this._actions.forEach(action => {
                action.handler(evt);
            }, this);

            //toggle tool
            const type = evt.type;
            let state;
            const viewModel = this.sketchViewModel;
            if (viewModel && viewModel.tool && viewModel.tool.toolId === 'drawtexttool') {
                // for the drawtexttool the behavior of activating the tool must be different to the other tools
                // after the first click, the tool should not be reactivated but only after canceling or finishing a text
                //otherwise the tool would be closed before one could enter a text
                state = evt.state ? viewModel.state : 'complete';
                state = type && type === 'remove' ? 'complete' : state;
            } else {
                // for all other tools it remains the same
                state = evt.state;
            }

            const tool = viewModel.tool;
            if (state === "complete" || (state === "cancel" && type !== "create")) {
                if (tool && tool.togglable && tool.active) {
                    (tool.id === 'drawpolygontool') && await this._sleep(500);
                    // if drawreshapetool is selected throw event, so that text editor in sketching_widget is closed after deselecting text
                    (viewModel.tool.toolId === 'drawreshapetool') && viewModel.emit('openSketchingEditor', {openSketchingEditor: false});
                    viewModel.activeTool || this.activateTool(tool);
                } else {
                    viewModel.updateOnGraphicClick = this._updateOnGraphicClick;
                }
            } else if (type === 'update' && state === 'start' && tool.toolId === 'drawreshapetool') {
                const symbol = viewModel._orgSymbols[0];
                // throw an event if reshape tool is used to edit sketching text so that the text editor can be opened
                (symbol && symbol.type === 'text') && viewModel.emit('openSketchingEditor', {
                    openSketchingEditor: true,
                    symbol
                });
                // TODO: for other types of symols, events could be emitted, so that symbol editor can be reopened for reshape tool
            }
        },

        _sleep(milliseconds) {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        }
    };
}


