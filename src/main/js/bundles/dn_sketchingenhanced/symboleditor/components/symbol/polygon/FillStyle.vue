<!--

    Copyright (C) 2020 con terra GmbH (info@conterra.de)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

            http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

-->
<template>
    <v-flex v-html="html"></v-flex>
</template>
<script>
    export default {
        props: {
            fillStyle: String,
            height: {type: Number, default: 20},
            color: {type: String, default: '#000000'},
            i18n: {type: Object, default: () => ({})},
        },

        computed: {
            html() {
                const color = this.color || 'black';
                let style = '';

                if (this.fillStyle === 'none') {
                    return this.i18n.noFillTitle;
                }

                switch (this.fillStyle) {
                    case 'solid':
                        style = `<rect width="100%" height="100%" fill="${color}"></svg>`;
                        break;
                    case 'vertical':
                        style = `<defs>` +
                            `<pattern id="pattern_vertical_${this._uid}" patternUnits="userSpaceOnUse" width="5" height="10" patternTransform="rotate(0)">` +
                            `<line x1="0" y1="0" x2="0" y2="10" stroke="${color}" stroke-width="2" />` +
                            `</pattern>` +
                            `</defs>` +
                            `<rect width="100%" height="100%" fill="url(#pattern_vertical_${this._uid})" :opacity="1" />`;
                        break;
                    case 'horizontal':
                        style = `<defs>` +
                            `<pattern id="pattern_horizontal_${this._uid}" patternUnits="userSpaceOnUse" width="5" height="10" patternTransform="rotate(90)">` +
                            `<line x1="0" y1="0" x2="0" y2="10" stroke="${color}" stroke-width="2" />` +
                            `</pattern>` +
                            `</defs>` +
                            `<rect width="100%" height="100%" fill="url(#pattern_horizontal_${this._uid})" :opacity="1" />`;
                        break;
                    case 'backward-diagonal':
                        style = `<defs>` +
                            `<pattern id="pattern_diagonal_${this._uid}" patternUnits="userSpaceOnUse" width="5" height="10" patternTransform="rotate(45)">` +
                            `<line x1="0" y1="0" x2="0" y2="10" stroke="${color}" stroke-width="2"/>` +
                            `</pattern>` +
                            `</defs>` +
                            `<rect width="100%" height="100%" fill="url(#pattern_diagonal_${this._uid})" opacity="1"/>`;
                        break;
                    case 'cross':
                        style = `<pattern id="pattern_cross_${this._uid}" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(0)">` +
                            `<path stroke="${color}" stroke-linecap="round" stroke-width="1" d="M 0,0 L 5,0"/>` +
                            `<path stroke="${color}" stroke-linecap="round" stroke-width="1" d="M 5,5 L 5,10"/>` +
                            `<path stroke="${color}" stroke-linecap="round" stroke-width="1" d="M 5,5 L 0,5"/>` +
                            `<path stroke="${color}" stroke-linecap="round" stroke-width="1" d="M 5,5 L 10,5"/>` +
                            `<path stroke="${color}" stroke-linecap="round" stroke-width="1" d="M 5,5 L 5,0"/>` +
                            `</pattern>` +
                            '</defs>' +
                            `<rect width="100%" height="100%" fill="url(#pattern_cross_${this._uid})" :opacity="1" />`;
                        break;
                    case 'diagonal-cross':
                        style = '<defs>' +
                            `<pattern id="pattern_diagonalcross_${this._uid}" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(0)">` +
                            `<path stroke="${color}" stroke-linecap="round" stroke-width="1" d="M 5,5 L 10,10"/>` +
                            `<path stroke="${color}" stroke-linecap="round" stroke-width="1" d="M 5,5 L 0,10"/>` +
                            `<path stroke="${color}" stroke-linecap="round" stroke-width="1" d="M 5,5 L 10,0"/>` +
                            `<path stroke="${color}" stroke-linecap="round" stroke-width="1" d="M 5,5 L 0,0"/>` +
                            '</pattern>' +
                            '</defs>' +
                            `<rect width="100%" height="100%" fill="url(#pattern_diagonalcross_${this._uid})" :opacity="1" />`;
                        break;
                    case 'forward-diagonal':
                        style = '<defs>' +
                            `<pattern id="pattern_backward_diagonal_${this._uid}" patternUnits="userSpaceOnUse" ` +
                            'width="5" height="10" patternTransform="rotate(135)">' +
                            `<line x1="0" y1="0" x2="0" y2="10" stroke="${color}" stroke-width="2"/></pattern></defs> ` +
                            `<rect width="100%" height="100%" fill="url(#pattern_backward_diagonal_${this._uid})" opacity="1"/>`;
                        break;
                    default:
                }

                if (style) {
                    return `<svg height="${this.height}" width="100%">${style}</svg>`;
                }

                return this.fillStyle;
            },
        },
    };
</script>
