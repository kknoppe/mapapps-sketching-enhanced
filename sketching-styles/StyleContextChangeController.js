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
import declare from "dojo/_base/declare";
import d_lang from "dojo/_base/lang";
import Connect from "ct/_Connect";
import ct_async from "ct/async";
import ct_lang from "ct/_lang";
import {stylesToSymbol, symbolToStyle} from "./SymbolAndCSSConverter";

/**
 * Responsible to inform the geometryRender about style changes in the StyleContext.
 */
module.exports = declare([Connect], {
    //injected
    _styleContext: null,
    _sketchingHandler: null,

    activate: function () {
        this.connectP(this._styleContext, "*", "_informAboutStyleChange");
    },
    deactivate: function () {
        this.disconnect();
    },
    set_styleContext(styleContext) {
        this._styleContext = styleContext;
        this._getStylesFromSketchViewModel();
    },
    set_sketchingHandler(sketchingHandler) {
        this._sketchingHandler = sketchingHandler;
        this._getStylesFromSketchViewModel();
    },
    _informAboutStyleChange: function () {
        const that = this;
        ct_async(function () {
            that._setSymbol("textSymbol", "point");
            that._setSymbol("pointSymbol", "point");
            that._setSymbol("polygonSymbol", "polygon");
            that._setSymbol("polylineSymbol", "polyline");

            const viewModel = that._getSketchViewModel();
            viewModel.bufferUnit = that._styleContext.bufferUnit;
            viewModel.bufferDistance = that._styleContext.bufferDistance;
        });
    },
    _setSymbol(name, type) {
        const viewModel = this._getSketchViewModel();
        if (viewModel) {
            const activeSymbol = viewModel.get(name);
            const symbol = activeSymbol.clone();
            const text = symbol.type === "text" && (symbol.text || "Text");
            d_lang.mixin(symbol, stylesToSymbol(type, this._styleContext, text));
            viewModel.set(name, symbol);
            if (viewModel.createGraphic && viewModel.createGraphic.symbol.id === activeSymbol.id) {
                viewModel.createGraphic.set("symbol", symbol);
            }
        }
    },
    _getStylesFromSketchViewModel() {
        if (this._styleContext && this._sketchingHandler) {
            const viewModel = this._getSketchViewModel();
            this._getStyles(viewModel.textSymbol, "point", "text");
            this._getStyles(viewModel.pointSymbol, "point");
            this._getStyles(viewModel.polygonSymbol, "polygon");
            this._getStyles(viewModel.polylineSymbol, "polyline");

            viewModel.bufferUnit && (this._styleContext.bufferUnit = viewModel.bufferUnit);
            viewModel.bufferDistance && (this._styleContext.bufferDistance = viewModel.bufferDistance);
        }
    },
    _getStyles(symbol, type, text) {
        const graphic = {
            symbol: symbol,
            geometry: {type: type},
            attributes: {text: text}
        };
        const styles = symbolToStyle(graphic);
        ct_lang.forEachProp(styles, (value, name) => {
            (value === undefined || value === null) && delete styles[name];
        });
        d_lang.mixin(this._styleContext, styles);
    },
    _getSketchViewModel() {
        return this._sketchingHandler._getSketchViewModel();
    }
});