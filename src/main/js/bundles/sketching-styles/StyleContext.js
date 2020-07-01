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
import Color from "dojo/_base/Color";
import Stateful from "ct/Stateful";
import ct_lang from "ct/_lang";


// transform colorString and transparency value into dojo/_base/color
const toColor = function (colorString, transparencyInPercent) {
    const color = new Color(colorString);
    if (transparencyInPercent) {
        color.a = 1 - (transparencyInPercent / 100);
    }
    return color;
};
/**
 * StyleContext, the model between style configuration and style presentation.
 */
const StyleContext = module.exports = declare([Stateful], {
    // default settings
    bufferDistance: 50,
    bufferUnit: "meters",

    strokeStyle: "solid",
    strokeWidth: 1,
    strokeColor: "#ff0000",
    strokeTransparency: 0,
    strokeCap: "round",
    strokeJoin: "round",
    strokeMiterLimit: 0.75,
    fillStyle: "solid",
    fillColor: "#000000",
    fillTransparency: 75,
    markerSize: 10,
    markerStyle: "circle",
    markerAngle: 0,
    markerXoffset: 0,
    markerYoffset: 0,

    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal",
    fontFamily: "Arial",
    fontDecoration: "none",

    textColor: "#ff0000",
    textTransparency: 0,
    textBackgroundColor: 0,
    textBackgroundTransparency: 0,
    textBorderLineSize: 0,
    textBorderLineColor: "#ffffff",
    textBorderLineTransparency: 0,
    textHaloSize: 0,
    textHaloColor: "#ffffff",
    textHaloTransparency: 0,
    textVerticalAlignment: "bottom", //"<baseline | top | middle | bottom>",
    textHorizontalAlignment: "left", //"<left | right | center | justify>",
    textAngle: 0,
    textXoffset: 0,
    textYoffset: 0,
    textRotated: false,
    textKerning: true,
    textRightToLeft: false,


    // default symbol id -> should this be saved?
    // if not simple remove it here
    symbolId: "general",
    /**
     * convinient function to access color/transparency values with one call
     * @example
     * const fillcolor = context.getColor("fill");
     * const strokecolor = context.getColor("stroke");
     * const textColor = context.getColor("font");
     *
     * @param {String} name the type of color (fill, stroke, font)
     * @return {dojo/_base/color} the color value
     */
    getColor: function (name) {
        const hex = this.get(name + "Color");
        const transparency = this.get(name + "Transparency");
        return hex && toColor(hex, transparency);
    },
    /**
     * @returns {Object} clean js object, containing all current styles.
     */
    getAll: function () {
        return ct_lang.copyProps({}, this, ct_lang.getOwnPropertiesArray(StyleContext.prototype));
    }
});
