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

import d_lang from "dojo/_base/lang";
import d_html from "dojo/_base/html";
import d_domclass from "dojo/dom-class";
import d_domconstruct from "dojo/dom-construct";
import d_win from "dojo/_base/window";
import TextSymbol from "esri/symbols/TextSymbol";
import Connect from "ct/_Connect";
import ct_async from "ct/async";
import TextArea from "dijit/form/Textarea";
import d_event from "dojo/_base/event";
import d_keys from "dojo/keys";
import has from "dojo/has";
import css from "ct/util/css";



export default class DrawTextController extends Connect {
    activate() {
        this._textbox = null;
    }

    deactivate() {
        this._destroyTextBox();
    }

    handler(evt) {
        const props = this._properties;
        const viewModel = this._sketchingHandler.sketchViewModel;
        viewModel.textSymbol.set("lineWidth",props.lineWidth || 512);
        const state = evt.state;
        const type = evt.type;
        const tool = viewModel.tool;
        const graphics = evt.graphics || [evt.graphic];
        const firstGraphic = graphics.length && graphics[0];
        if (firstGraphic) {
            // draw help line if state is textbox is static
            if (state !== 'active' && tool && tool.id === 'drawtexttool') {
                this._drawTextHelpLine.createHelpLine(firstGraphic, viewModel);
            } else {
                this._drawTextHelpLine.removeHelpLine(viewModel);
            }
            if (type === "create" && tool && tool.type === "text") {
                if (state === "complete") {
                    this._renderTextBox(firstGraphic, viewModel);
                } else if (state === "cancel") {
                    this._onCancelInput();
                }
            } else if (type === "update") {
                const orgSymbols = viewModel._orgSymbols;
                let symbol = orgSymbols && orgSymbols[0];
                if (symbol && symbol.type === "text") {
                    if (state === "start") {
                        this._renderTextBox(firstGraphic, viewModel, symbol.text);
                    } else if (state === "complete" || state === "cancel") {
                        this._destroyTextBox();
                        firstGraphic.set("symbol", TextSymbol.fromJSON(viewModel.textSymbol.toJSON()));
                    }
                }
            }
        } else {
            // remove help line
            this._drawTextHelpLine.removeHelpLine(viewModel);
        }
    }

    _renderTextBox(graphic, viewModel, text) {
        // cancel any not full finished rendering
        this._onFinishInput();

        const view = viewModel.view;
        const textSymbol = viewModel.textSymbol;
        textSymbol.text = "";
        !text && graphic.set("symbol", null);

        const mapPoint = graphic.geometry;
        const screenPoint = view.toScreen(mapPoint);
        const anchorNode = view.container;

        const font = textSymbol.font;
        const tbOpts = {
            "class": "ctDrawText",
            trim: true,
            style: {
                position: "absolute",
                color: textSymbol.color.toHex(),
                fontFamily: font.family,
                fontStyle: font.style,
                fontSize: font.size + "px",
                fontWeight: font.weight
            },
            // save for later access
            viewModel: viewModel,
            graphic: graphic
        };

        const ieVersion = has("ie");
        if (!ieVersion || ieVersion > 8) {
            tbOpts.style.textDecoration = textSymbol.get("fontDecoration");
        }

        const textbox = this._textbox = new TextArea(tbOpts);

        const textboxInputNode = textbox.domNode;
        let width = this._calculateWidth();
        const extentsTextBox = css.getMarginPadBorderExtents(textboxInputNode);
        const wOffset = extentsTextBox.w + extentsTextBox.l;
        width = width + wOffset;
        const minWidth = Math.max(0, (this._properties.minWidth || 400));
        const maxWidth = Math.max(0, (this._properties.maxWidth || 800));
        width = Math.max(minWidth, width);
        if (maxWidth) {
            width = Math.min(maxWidth, width);
        }
        const lineWidth = this._properties.lineWidth;
        d_html.contentBox(textboxInputNode, {w: lineWidth || width});
        d_domclass.add(textbox.domNode, "ctAutoResizeTextBox");

        !!text && (textbox.textbox.value = text);

        this.connect("textbox", textbox, "onBlur", "_onFinishInput");
        this.connect("textbox", textbox, "onKeyPress", "_onTextBoxKeypress");

        textbox.placeAt(anchorNode).startup();
        const textboxNode = textbox.domNode;
        const textboxSize = d_html.marginBox(textboxNode);
        d_html.marginBox(textboxNode, {
            l: screenPoint.x,
            t: screenPoint.y - textboxSize.h
        });
        // needs to be async to let in run in IE 10
        ct_async(textbox.focus, textbox);
    }

    _destroyTextBox() {
        this.disconnect("textbox");
        const textbox = this._textbox;
        if (textbox) {
            textbox.destroyRecursive();
            this._textbox = null;
        }
    }

    _isUpdate(viewModel) {
        return viewModel && viewModel.activeTool === "move";
    }

    _onFinishInput() {
        const textbox = this._textbox;
        if (textbox) {
            const text = textbox.get("value");
            if (!text) {
                this._onCancelInput();
            } else {
                this._destroyTextBox();

                const graphic = textbox.graphic;
                const viewModel = textbox.viewModel;

                viewModel.textSymbol.text = text;
                const textSymbol = d_lang.clone(viewModel.textSymbol);
                if (this._isUpdate(viewModel)) {
                    textSymbol.color.a = 1;
                    textSymbol.color.r = 255;
                    textSymbol.color.g = 0;
                    textSymbol.color.b = 0;
                    textSymbol.font.style = "italic";
                }
                graphic.set("symbol", TextSymbol.fromJSON(textSymbol.toJSON()));
                if (graphic.symbol.haloSize === 0) {
                    // unset haloColor, because it changes the symbology when foreground color has opacity
                    graphic.symbol.haloColor = null;
                }
                // after adding text to the map, trigger the _onSketchUpdateHandler
                viewModel.emit('update', {target: viewModel});
            }
        }
    }

    _onCancelInput() {
        const textbox = this._textbox;
        this._destroyTextBox();
        if (textbox) {
            const viewModel = textbox.viewModel;
            if (this._isUpdate(viewModel)) {
                const orgSymbol = viewModel._orgSymbols[0];
                viewModel.textSymbol.text = orgSymbol.text;
                textbox.graphic.set("symbol", TextSymbol.fromJSON(viewModel._orgSymbols[0].toJSON()));
                viewModel.cancel();
            } else {
                viewModel.layer.remove(textbox.graphic);
                viewModel.emit("remove", {
                    graphics: [],
                    state: "complete",
                    type: "remove"
                });
            }
        }
    }

    _onTextBoxKeypress(event) {
        if (event.keyCode === d_keys.TAB) {
            d_event.stop(event);
            this._onFinishInput();
        } else if (event.keyCode === d_keys.ESCAPE) {
            d_event.stop(event);
            this._onCancelInput();
        }
    }

    _calculateWidth() {
        const textbox = this._textbox;
        let sizeCalcDiv;
        const s = d_html.style;
        const node = textbox.domNode;
        // Creating a temp div with current box style to get the value width
        const tmpDiv = sizeCalcDiv || (sizeCalcDiv = d_domconstruct.create("div", {
            style: {
                "zIndex": -1000,
                "position": "absolute",
                "visibility": "hidden",
                "border": "none",
                "margin": "0",
                "padding": "0",
                "top": "0px",
                "left": "0px"
            }
        }, d_win.body()));
        s(tmpDiv, {
            "fontSize": s(node, "fontSize") || "12px",
            "fontFamily": s(node, "fontFamily") || "Arial",
            "fontWeight": s(node, "fontWeight") || "normal",
            "fontStyle": s(node, "fontStyle") || "normal",
            "display": "block"
        });
        const value = textbox.get("value") || "";
        const placeholder = textbox.get("placeHolder") || "";
        // Need "_" at end to precalculate next char into size
        const divVal = (value.length < placeholder.length ? placeholder : value) + "_";
        tmpDiv.innerHTML = divVal.replace(/ /g, "&nbsp;");
        const size = d_html.contentBox(tmpDiv).w;
        s(tmpDiv, {"display": "none"});
        return size;
    }

}
