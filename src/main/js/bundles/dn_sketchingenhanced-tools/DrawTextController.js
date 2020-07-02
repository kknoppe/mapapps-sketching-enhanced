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
import TextSymbol from "esri/symbols/TextSymbol";
import Connect from "ct/_Connect";
import ct_async from "ct/async";
import AutoResizeTextBox from "ct/ui/controls/forms/AutoResizeTextBox";
import d_event from "dojo/_base/event";
import d_keys from "dojo/keys";
import has from "dojo/has";


export default class DrawTextController extends Connect {
    activate() {
        this._textbox = null;
    }

    deactivate() {
        this.deactivateDrawText();
    }

    handler(evt) {
        const viewModel = evt.target;
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

        const textbox = this._textbox = new AutoResizeTextBox(tbOpts);
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
        if (event.keyCode === d_keys.TAB || event.keyCode === d_keys.ENTER) {
            d_event.stop(event);
            this._onFinishInput();
        } else if (event.keyCode === d_keys.ESCAPE) {
            d_event.stop(event);
            this._onCancelInput();
        }
    }

}
