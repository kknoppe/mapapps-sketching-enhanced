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
import PointAction from "./actions/PointMeasurementAction"
import PolylineAction from "./actions/PolylineMeasurementAction"
import PolygonAction from "./actions/PolygonMeasurementAction"

export default class MeasurementHandler {
    activate() {
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

        this._measurementDisabledTools = props.disabledMeasurementTools;
    }

    handler(evt) {
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
            evt.toolEventInfo && this.setCoordinates(evt);
        }

        // cases in which to exit
        if (evt.state === 'cancel'){
            return;
        }

        switch(evt.type){
            case 'create':
                if (evt.tool && showMeasurement){
                    this._handleCreate(evt);
                }
                break;
            case 'redo':
            case 'undo':
            case 'update':
                if (evt.graphics && showMeasurement){
                    this._handleUpdate(evt);
                }
                break;
            case 'remove':
                this._handleRemove(evt);
                break;
        }
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
                    this.controller.resetMeasurementResults();
                    break;
                case 'active':
                    if (this._model.cursorUpdate){
                        this.controller.removeTemporaryMeasurements(evt);
                    }
                    break;
                case 'cancel':
                    this.controller.resetMeasurementResults();
                    evt.graphic && this.controller.removeGraphicsById(evt.graphic.getAttribute("id"));
                    break
                case 'complete':
                    this._recordMeasurements(evt);
                    break;

            }
        }
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
        const enabled = this._model.measurementEnabled;
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
        handler._getMeasurements(evt);
    }

    _handleUpdate(evt){
        // remove text graphics
        if (!evt.graphics[0].ignoreOnReshape){
            const type = evt.graphics[0].geometry.type
            const handler = this.getMeasurementAction(type);
            handler && handler._updateMeasurements(evt);
        }
    }

    _handleRemove(evt){
        if (!evt.graphics) return;
        const id = evt.graphics[0].attributes?.id || evt.graphics[0].symbol.id;
        this.controller.removeGraphicsById(id);
        this.controller.resetMeasurementResults();
        this.setActiveToolType(this._model.activeTool);
    }

    getMeasurementAction(tool){
        return this._measurementActions.find(action => action.actionType === tool)
    }

    _startMeasurementHandlers(){
        this.controller._properties = this._properties;
        this.controller.viewModel = this.viewModel;
        this.controller.resetMeasurementResults();
        this._model.watch("measurementEnabled",(evt)=>{
            if (this._model.activeTool){
                this.setActiveToolType(this._model.activeTool);
            }
        });
        const args = {
            _properties: this._properties,
            viewModel: this.viewModel,
            _model: this._model,
            controller: this.controller,
            coordinateTransformer: this._coordinateTransformer,
            i18n: this.i18n
        }
        this._measurementActions.push(new PointAction(args))
        this._measurementActions.push(new PolylineAction(args))
        this._measurementActions.push(new PolygonAction(args))
    }

    setCoordinates(evt){
        this._model.coordinates = evt.toolEventInfo.added || evt.toolEventInfo.coordinates;
    }

    setLengthUnits(unit){
        switch(unit){
            case "meter":
            case "meters":
                this._model.lengthUnit = 'meters'
                break;
            case "kilometer":
            case "kilometers":
                this._model.lengthUnit = 'kilometers'
                break;
            default:
                this._model.lengthUnit = 'auto'
                break;
        }
    }

    setAreaUnits(unit){
        switch(unit){
            case "square meters":
            case "quadratmeter":
                this._model.areaUnit = 'square-meters';
                break;
            case "square kilometers":
            case "quadratkilometer":
                this._model.areaUnit = 'square-kilometers';
                break;
            case "hectares":
            case "hektar":
                this._model.areaUnit = 'hectares';
            default:
                this._model.lengthUnit = 'auto';
                break;
        }
    }

    setCoordinatesystem(system) {
        this._model.srs = system;
    }

    /*
     * ct.framework.api.EventHandler
     */
    _setSketchViewModel(evt) {
        if (!this.viewModel) {
            this.viewModel = evt.getProperty("viewModel");
            this._startMeasurementHandlers();
        }
    }
}
