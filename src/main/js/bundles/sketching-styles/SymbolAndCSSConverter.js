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
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol from "esri/symbols/SimpleLineSymbol";
import SimpleFillSymbol from "esri/symbols/SimpleFillSymbol";
import TextSymbol from "esri/symbols/TextSymbol";
import Font from "esri/symbols/Font";

/* eslint-disable no-undef */

// Support for SimpleTextSymbols
const _textAttribute = "text";
const converter = {};
converter.stylesToSymbol = function (geomType, styleContext, textValue) {
    if (textValue && geomType === "point") {
        return _createTS(styleContext, textValue);
    }
    switch (geomType) {
        case "point":
        case "multipoint":
            return _createSMS(styleContext);
        case "polygon":
        case "extent":
            return _createSFS(styleContext);
        case "polyline":
            return _createSLS(styleContext, 1);
    }
};
converter.symbolToStyle = function (graphic) {
    const symbol = graphic.symbol;
    const geomType = graphic.geometry.type;
    const attributes = graphic.attributes;
    if (symbol.type === "picturemarkersymbol") {
        return {symbolId: symbol.id};
    }
    const textValue = graphic[_textAttribute] || symbol && symbol[_textAttribute] || attributes
        && attributes[_textAttribute];
    if (textValue && geomType === "point") {
        return _getStylesFromTS(symbol, textValue);
    }
    switch (geomType) {
        case "point":
        case "multipoint":
            return _getStylesFromSMS(symbol);
        case "polygon":
        case "extent":
            return _getStylesFromSFS(symbol);
        case "polyline":
            return _getStylesFromSLS(symbol);
    }
};
_createSLS = function (styleContext, minWidth) {
    return new SimpleLineSymbol({
        cap: styleContext.get("strokeCap"),
        color: styleContext.getColor("stroke"),
        join: styleContext.getColor("strokeJoin"),
        miterLimit: styleContext.getColor("strokeMiterLimit"),
        style: styleContext.get("strokeStyle"),
        width: Math.max(minWidth || 0, styleContext.get("strokeWidth"))
    });
};
_createSMS = function (styleContext) {
    let outline = _createSLS(styleContext);
    const color = styleContext.getColor("fill");
    const fillStyle = styleContext.get("fillStyle");
    fillStyle === "none" && (color.a = 0);
    outline = _adjustOutlineForCrossAndX(outline, styleContext.markerStyle, color, styleContext.markerSize);

    return new SimpleMarkerSymbol({
        color: color,
        outline: outline,
        angle: styleContext.get("markerAngle"),
        xoffset: styleContext.get("markerXoffset"),
        yoffset: styleContext.get("markerYoffset"),
        style: styleContext.get("markerStyle"),
        size: styleContext.get("markerSize")
    });
};

_createSFS = function (styleContext) {
    return new SimpleFillSymbol({
        color: styleContext.getColor("fill"),
        style: styleContext.get("fillStyle"),
        outline: _createSLS(styleContext)
    });
};

_createTS = function (styleContext, text) {
    const font = new Font({
        decoration: styleContext.get("fontDecoration"),
        family: styleContext.get("fontFamily"),
        size: styleContext.get("fontSize"),
        style: styleContext.get("fontStyle"),
        weight: styleContext.get("fontWeight")
    });
    return new TextSymbol({
        color: styleContext.getColor("text"),
        backgroundColor: styleContext.getColor("textBackground"),
        borderLineSize: styleContext.get("textBorderLineSize"),
        borderLineColor: styleContext.getColor("textBorderLine"),
        haloSize: styleContext.get("textHaloSize"),
        haloColor: styleContext.getColor("textHalo"),
        verticalAlignment: styleContext.get("textVerticalAlignment"),
        horizontalAlignment: styleContext.get("textHorizontalAlignment"),
        rightToLeft: styleContext.get("textRightToLeft"),
        angle: styleContext.get("textAngle"),
        xoffset: styleContext.get("textXoffset"),
        yoffset: styleContext.get("textYoffset"),
        kerning: styleContext.get("textKerning"),
        font: font,
        text: text
    });
};
_getColorStyles = function (color, colorName, styles) {
    if (color) {
        styles[colorName + "Color"] = color.toHex();
        styles[colorName + "Transparency"] = 100 - color.a * 100; // eslint-disable-line no-magic-numbers
    }
    return styles;
};
_getStylesFromSLS = function (lineSymbol) {
    const styles = {
        strokeStyle: lineSymbol.style,
        strokeWidth: lineSymbol.width,
        strokeCap: lineSymbol.cap,
        strokeJoin: lineSymbol.join,
        strokeMiterLimit: lineSymbol.miterLimit
    };
    _getColorStyles(lineSymbol.color, "stroke", styles);
    return styles;
};
_getStylesFromSMS = function (markerSymbol) {
    const styles = _getStylesFromSLS(markerSymbol.outline);
    _getColorStyles(markerSymbol.color, "fill", styles);

    styles.markerSize = markerSymbol.size;
    styles.markerStyle = markerSymbol.style;
    styles.markerAngle = markerSymbol.angle;
    styles.markerXoffset = markerSymbol.xoffset;
    styles.markerYoffset = markerSymbol.yoffset;
    return styles;
};
_getStylesFromSFS = function (symbol) {
    const styles = _getStylesFromSLS(symbol.outline);
    _getColorStyles(symbol.color, "fill", styles);
    styles.fillStyle = symbol.style;
    return styles;
};
_getStylesFromTS = function (textSymbol) {
    const styles = {};
    const font = textSymbol.font;
    styles.fontSize = font.size;
    styles.fontStyle = font.style;
    styles.fontWeight = font.weight;
    styles.fontFamily = font.family;
    styles.fontDecoration = font.decoration;

    _getColorStyles(textSymbol.color, "text", styles);
    _getColorStyles(textSymbol.backgroundColor, "textBackground", styles);
    _getColorStyles(textSymbol.borderLineColor, "textBorderLine", styles);
    _getColorStyles(textSymbol.haloColor, "textHalo", styles);

    styles.textAngle = textSymbol.angle;
    styles.textBorderLineSize = textSymbol.borderLineSize;
    styles.textHaloSize = textSymbol.haloSize;

    styles.textVerticalAlignment = textSymbol.verticalAlignment;
    styles.textHorizontalAlignment = textSymbol.horizontalAlignment;
    styles.textAngle = textSymbol.angle;
    styles.textRotated = textSymbol.rotated;
    styles.textKerning = textSymbol.kerning;
    styles.textRightToLeft = textSymbol.rightToLeft;

    return styles;
};

const _adjustOutlineForCrossAndX = function(outline, markerStyle, color, size) {
    let newOutline = outline;
    if(markerStyle === 'cross' || markerStyle === 'x') {
        newOutline.cap = 'butt';
        newOutline.color = color;
        newOutline.width = Math.round(size/3.);
    }
    return newOutline;
};

module.exports = converter;
