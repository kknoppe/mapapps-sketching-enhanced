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
import PointAction from "./actions/PointMeasurementAction";
import PolylineAction from "./actions/PolylineMeasurementAction";
import PolygonAction from "./actions/PolygonMeasurementAction";
import TopicEvent from 'apprt/event/Event';
import { MeasurementLayer } from "./MeasurementLayer";
import { MeasurementLabelProvider } from "./labels/MeasurementLabelProvider";
import { PolygonLabelProvider } from "./labels/PolygonLabelProvider";
import { PolylineLabelProvider } from "./labels/PolylineLabelProvider";

export default class MeasurementHandler {

    currentAction = [];

    activate(context) {
        this.bundleContext = context.getBundleContext();
        this.i18n = this._i18n.get();
        this.viewModel = null;
        this._measurementActions = [];
        const props = this._properties;
        this._model.mDecimal = props.decimalPlacesMeter;
        this._model.kmDecimal = props.decimalPlacesKiloMeter;
        this._model.textSettings = props.sketch.textSymbol;
        this._model.lineSettings = props.sketch.polylineSymbol;
        this._model.showLineMeasurementsAtPolylines = props.showLineMeasurementsAtPolylines;
        this._model.showLineMeasurementsAtPolygons = props.showLineMeasurementsAtPolygons;
        this._model.showAngleMeasurementsAtPolylines = props.showAngleMeasurementsAtPolylines;
        this._model.enableAngleMeasurement = props.enableAngleMeasurement;

        this._measurementDisabledTools = props.disabledMeasurementTools;

        // set viewModel if SketchingHandler was started before this component
        if (this.sketchingHandler?.sketchViewModel) {
            this._setSketchViewModel(new TopicEvent('must_not_be_empty', { viewModel: this.sketchingHandler.sketchViewModel }));
        }
    }

    async handler(evt) {
        this._model.spatialReference = this.viewModel.view.spatialReference;
        const showMeasurement = this._showMeasurementsAllowed(evt);
        this._model.cursorUpdate = evt.toolEventInfo && evt.toolEventInfo.type === "cursor-update";
        this._model.vertexAdded = evt.toolEventInfo && evt.toolEventInfo.type === "vertex-add";

        this._handleEventState(evt);

        if (evt.activeTool) {
            if (this._measurementDisabledTools.includes(evt.activeTool)){
                if (evt.graphic){
                    evt.graphic.ignoreOnReshape = true;
                }
                return;
            }
            this._recordMeasurements(evt);
        }

        // cases in which to exit
        if (evt.state === 'cancel'){
            return;
        }

        let action;

        switch(evt.type){
            case 'create':
                if (evt.tool && showMeasurement){
                    action = this._handleCreate;
                }
                break;
            case 'redo':
            case 'undo':
            case 'update':
                if (evt.graphics && showMeasurement){
                    action = this._handleUpdate;
                }
                break;
            case 'delete':
            case 'remove':
                action = this._handleRemove;
                break;
        }

        // call events sequentially
        this.currentAction = Promise.resolve(this.currentAction).then(() => action?.call(this, evt)).catch(console.error);
    }

    _showMeasurementsAllowed(evt){
        let measurementEnabledAttr = false;
        if (evt.graphics && evt.graphics[0]){
            measurementEnabledAttr = evt.graphics[0].getAttribute('measurementEnabled')
        }
        return this._model.measurementEnabled || measurementEnabledAttr;
    }

    _handleEventState(evt){
        if (evt.tool && this._model.measurementEnabled) {
            switch(evt.state){
                case 'start':
                    this.resetMeasurementResults();
                    break;
                case 'active':
                    if (this._model.cursorUpdate){
                        this.removeTemporaryMeasurements(evt);
                    }
                    break;
                case 'cancel':
                    this.resetMeasurementResults();
                    this._setGraphics(evt)
                    this._handleRemove(evt)
                    // evt.graphic && this.removeGraphicsById(evt.graphic.getAttribute("id"));
                    break
                case 'complete':
                    this._recordMeasurements(evt);
                    break;

            }
        }
    }



    removeTemporaryMeasurements(evt) {
        const update = evt.type === 'update' || evt.type === 'undo' || evt.type === 'redo';
        const graphic = update ? evt.graphics[0] : evt.graphic;
        if (!graphic) return;
        const id = graphic.getAttribute("id") || `measurement-${graphic.uid}`;
        const viewModel = this.viewModel;
        const gs = viewModel.layer.graphics.items.filter(g => {
            const type = g.getAttribute("type");
            const textGraphicId = g.getAttribute("id");
            const temporary = g.symbol?.temporary;
            if (textGraphicId) {
                return g.getAttribute("id") === id && type && type === "text" && temporary;
            }
        });
        viewModel.layer.removeMany(gs);
    }

    /*
     * acts on draw events to begin recording measurements in container
     * @param evt
     * @private
     */
    _recordMeasurements(evt){
        if (evt.type === "create" && (evt.state === "active" || evt.state === "complete")){
            switch(evt.toolEventInfo?.type){
                case("cursor-update"):
                    this.controller.showActiveResultsInTab(evt);
                    break;
                case("draw-complete"):
                case("vertex-add"):
                    this.controller.showCompleteResultsInTab(evt);
                    break
            }

        }
    }

    setActiveToolType(toolId){
        this._disableAllTools();
        const enabled = true;
        switch(toolId) {
            case "drawpointtool":
                this._model.pointEnabled = enabled;
                this._model.activeTool = toolId;
                break;
            case "drawpolylinetool":
            case "drawfreehandpolylinetool":
                this._model.polylineEnabled = enabled;
                this._model.activeTool = toolId;
                break;
            case "drawpolygontool":
            case "drawfreehandpolygontool":
                this._model.polygonEnabled = enabled;
                this._model.activeTool = toolId;
                break;
            case "drawrectangletool":
            case "drawtriangletool":
            case "drawcircletool":
            case "drawellipsetool":
                this._model.areaEnabled = enabled;
                this._model.activeTool = toolId;
                break;
        }
    }

    _disableAllTools(){
        ['pointEnabled','polylineEnabled','polygonEnabled','areaEnabled'].forEach(tool => {
            this._model[tool] = false;
        })
    }

    _handleCreate(evt){
        if (evt.state === 'cancel' || !evt.graphic){
            return;
        }
        const toolType = evt.graphic.geometry.type || evt.tool;
        const handler = this.getMeasurementAction(toolType);

        this.controller.setGraphicAttributes(evt);
        return handler?._getMeasurements(evt);
    }

    _handleUpdate(evt) {
        return this.executeHandler(evt, (handler, e) => handler?._updateMeasurements?.(e));
    }

    _groupGraphicsByGeometryType(graphics) {
        // group graphics by geometry type
        const groups = graphics?.reduce?.((group, graphic) => {
            group[graphic.geometry.type] = (group[graphic.geometry.type] || []).concat([graphic]);
            return group;
        }, {});

        // filter all graphics, that should be ignored by measurement
        return Object.entries(groups).reduce((group, [type, graphics]) => {
            group[type] = graphics
                .filter(g => !g.ignoreOnReshape)
                .filter(x => x.getAttribute('measurementEnabled'));
            if (group[type].length === 0) {
                // all graphics were filtered
                delete group[type];
            }
            return group;
        }, groups);
    }

    executeHandler(evt, callback) {
        const callbacks = [];
        const groupedGeometries = this._groupGraphicsByGeometryType(evt.graphics);
        for ([geometryType, graphics] of Object.entries(groupedGeometries)) {
            const handler = this.getMeasurementAction(geometryType);
            callbacks.push(callback?.(handler, { ...evt, graphics }));
        }

        return Promise.all(callbacks);
    }

    _setGraphics(evt){
        if(!evt.graphics && evt.graphic){
            evt.graphics = []
            evt.graphics[0] = evt.graphic
        }
    }

    _handleRemove(evt) {
        if (!evt.graphics) return;
        const id = evt.graphics[0].attributes?.id || evt.graphics[0].symbol.id;
        this.removeGraphicsById(id);
        this.resetMeasurementResults();
        this.setActiveToolType(this._model.activeTool);

        return this.executeHandler(evt, (handler, e) => handler?.deleteMeasurements?.(e));
    }

    removeGraphicsById(id) {
        const gs = this.viewModel.layer.graphics.items.filter(graphic => {
            const textGraphicId = graphic.getAttribute("id");
            if (textGraphicId) {
                return textGraphicId === id;
            }
        });
        this.viewModel.layer.removeMany(gs);
    }

    getMeasurementAction(tool){
        return this._measurementActions.find(action => action.actionType === tool)
    }

    _startMeasurementHandlers(){
        this.controller.setProperties(this._properties);
        this.controller.viewModel = this.viewModel;
        this.resetMeasurementResults();
        this._model.watch("measurementEnabled",(evt)=>{
            if (this._model.activeTool){
                this.setActiveToolType(this._model.activeTool);
            }
        });

        this._measurementActions.push(new PointAction(this._model, this.layer, this.controller.calculator));
        const labelProvider = new MeasurementLabelProvider(this._properties?.measurementLabels, this.i18n);

        // create PolylineAction
        const polylineLabelProvider = new PolylineLabelProvider(labelProvider, this._properties.showTotalLineMeasurementsAtPolylines);
        this._measurementActions.push(new PolylineAction(this.layer, this.controller.calculator, polylineLabelProvider, this.controller.angleCalculator));
        
        // create PolygonAction
        const polygonLabelProvider = new PolygonLabelProvider(labelProvider, this._properties.showCircumferenceMeasurementAtPolygons);
        this._measurementActions.push(new PolygonAction(this.layer, this.controller.calculator, polygonLabelProvider));
    }

    /*
     * resets all measurements on the data model
     * @param none
     * @public
     */
    resetMeasurementResults() {
        this._model.coordinates = null;
        this._model.currentLength = 0;
        this._model.aggregateLength = 0
        this._model.totalLength = 0;
        this._model.area = 0;
        this._model.currentArea = 0;
        this._model.perimeter = 0;
    }

    /*
     * ct.framework.api.EventHandler
     */
    _setSketchViewModel(evt) {
        if (!this.viewModel) {
            this.viewModel = evt.getProperty("viewModel");

            // Create Layer for measurements
            const layer = this.layer = new MeasurementLayer();
            layer.listMode = 'hide';
            layer.legendEnabled = false;
            layer.textSettings = this._model?.textSettings;
            layer.setReferenceLayer(this.viewModel.layer);
            this.bundleContext.registerService('dn_sketchingEnhanced.Layer', {layer, order: 150}, {ignoreInSnapping: true});
            this._model._mapWidgetModel.map.add(layer);

            this._startMeasurementHandlers();
        }
    }
}
