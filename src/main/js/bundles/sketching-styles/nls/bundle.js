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
module.exports = {
    root: {
        ui: {
            options: {
                angle: "Angle",
                angleModulus: "Angle",
                angleTypeRelative: "Relative Angle",
                planarLength: "Length",
                hint: {
                    angle: "Press \"w\" key continuously while drawing to use the angle",
                    angleModulus: "Press \"w\" key continuously while drawing to use the angle modulus",
                    planarLength: "Press \"l\" key continuously while drawing to use the length",
                },
                btnSave: "Use",
                btnCancel: "Close"
            },
            styleProperties: {
                tool: {
                    title: "Draw Properties",
                    tooltip: "Draw Properties"
                },
                buffer: {
                    title: "Buffer",
                    distance: "Distance",
                    unit: "Unit",
                    units: {
                        meters: "Meters"
                    }
                },
                text: {
                    title: "Text",
                    fontFamily: "Font",
                    fontSize: "Size",
                    textColor: "Color",
                    fontStyle: {
                        title: "Style",
                        bold: "Bold",
                        italic: "Italic",
                        underlined: "Underlined"
                    },
                    textTransparency: "Transparency",
                    textBackgroundColor: "Background Color",
                    textBorderLineSize: "Border Line Size",
                    textBorderLineColor: "Border Line Color",
                    textHaloSize: "Halo Sie",
                    textHaloColor: "Halo Color",
                    textVerticalAlignment: "Vertical Alignment", //"<baseline | top | middle | bottom>",
                    textHorizontalAlignment: "Horizontal Alignment", //"<left | right | center | justify>",
                    textRightToLeft: "Text Right To Left",
                    textAngle: "Angle",
                    textKerning: "Adjust Kerning",
                    textRrotated: "character rotated"
                },
                symbol: {
                    title: "Stroke/Fill",
                    stroke: {
                        title: "Stroke",
                        color: "Color",
                        style: "Style",
                        width: "Weight",
                        transparency: "Transparency",
                        strokeval: {
                            none: "None"
                        },
                        cap: "Cap Style",
                        capval: {
                            butt: "Butt",
                            round: "Round",
                            square: "Square",
                        },
                        join: "Join Style",
                        joinval: {
                            bevel: "Bevel corner",
                            miter: "Miter corner",
                            round: "Round corner"
                        },
                        miterLimit: "Miter Limit"
                    },
                    fill: {
                        title: "Fill",
                        color: "Color",
                        pattern: "Pattern",
                        transparency: "Transparency",
                        patternval: {
                            none: "None",
                            solid: "Solid",
                            vertical: "Black-Vertical",
                            horizontal: "Black-Horizontal",
                            backwarddiagonal: "Black-BackwardDiagonal",
                            forwarddiagonal: "Black-ForwardDiagonal",
                            cross: "Black-Cross",
                            diagonalcross: "Black-DiagonalCross"
                        }
                    }
                },
                marker: {
                    title: "Marker",
                    style: "Style",
                    size: "Size",
                    angle: "Angle",
                    styleval: {
                        circle: "Circle",
                        square: "Square",
                        cross: "Plus",
                        diamond: "Diamond",
                        triangle: "Triangle",
                        x: "Cross"
                    }
                },
                symbols: {
                    "title": "Symbols"
                }
            }
        }
    },
    de: true
};
