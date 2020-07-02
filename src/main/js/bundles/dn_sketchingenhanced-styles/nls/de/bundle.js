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
    bundleName: "Sketching Enhanced Styles",
    bundleDescription: "Sketching Enhanced Styles",
    ui: {
        options: {
            angle: "Winkel",
            angleModulus: "Winkel",
            angleTypeRelative: "Relativer Winkel",
            planarLength: "Länge",
            hint: {
                angle: "Taste \"w\" beim Zeichnen gedrückt halten, um den Winkel zu verwenden.",
                angleModulus: "Taste \"l\" beim Zeichnen gedrückt halten, um den Winkel und/oder die Länge zu verwenden.",
                planarLength: "Taste \"l\" beim Zeichnen gedrückt halten, um den Winkel und/oder die Länge zu verwenden."
            },
            btnSave: "Verwenden",
            btnCancel: "Schliessen"
        },
        styleProperties: {
            tool: {
                title: "Zeichen Eigenschaften",
                tooltip: "Zeichen Eigenschaften"
            },
            buffer: {
                title: "Puffer",
                distance: "Abstand",
                unit: "Einheit",
                units: {
                    meters: "Meter"
                }
            },
            text: {
                title: "Text",
                fontFamily: "Schriftart",
                fontSize: "Schriftgr\u00F6\u00dfe",
                textColor: "Farbe",
                fontStyle: {
                    title: "Stil",
                    bold: "Fett",
                    italic: "Kursiv",
                    underlined: "Unterstrichen"
                },
                textTransparency: "Transparenz",
                textBackgroundColor: "Hintergrundfarbe",
                textBorderLineSize: "Rahmenliniengröße",
                textBorderLineColor: "Rahmenlinienfarbe",
                textHaloSize: "Halo-Größe",
                textHaloColor: "Halo-Farbe",
                textVerticalAlignment: "Vertikale Ausrichtung", //"<baseline | top | middle | bottom>",
                textHorizontalAlignment: "Horizontal Ausrichtung", //"<left | right | center | justify>",
                textRightToLeft: "Text von rechts nach links",
                textAngle: "Winkel",
                textKerning: "Abstand anpassen",
                textRrotated: "Jedes Zeichen drehen"

            },
            symbol: {
                title: "Linie/F\u00fcllung",
                stroke: {
                    title: "Linie",
                    color: "Farbe",
                    style: "Stil",
                    width: "St\u00E4rke",
                    transparency: "Transparenz",
                    strokeval: {
                        none: "Kein"
                    },
                    cap: "Ende",
                    capval: {
                        butt: "Stumpf",
                        round: "Rund",
                        square: "Quadrat",
                    },
                    join: "Verbindung",
                    joinval: {
                        bevel: "Abgeschrägte Ecke",
                        miter: "Gehrungsecke",
                        round: "Runde Ecke"
                    },
                    miterLimit: "Gehrungsgröße"
                },
                fill: {
                    title: "F\u00fcllung",
                    color: "Farbe",
                    pattern: "F\u00fcllmuster",
                    transparency: "Transparenz",
                    patternval: {
                        none: "Kein",
                        solid: "Einfarbig",
                        vertical: "Vertikale Linien",
                        horizontal: "Horizontale Linien",
                        backwarddiagonal: "Diagonal von rechts",
                        forwarddiagonal: "Diagonal von links",
                        cross: "Kariert",
                        diagonalcross: "Diagonal gekreuzt"
                    }
                }
            },
            marker: {
                title: "Marker",
                style: "Stil",
                size: "Gr\u00F6ße",
                angle: "Winkel",
                styleval: {
                    circle: "Kreis",
                    square: "Quadrat",
                    cross: "Plus",
                    diamond: "Diamant",
                    triangle: "Dreieck",
                    x: "Kreuz"
                }
            },
            symbols: {
                "title": "Symbole"
            }
        }
    }
};
