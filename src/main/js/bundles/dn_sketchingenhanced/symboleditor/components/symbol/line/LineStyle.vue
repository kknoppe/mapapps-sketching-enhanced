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
            i18n: {type: Object, default: () => ({})},
            lineStyle: String,
            height: {type: Number, default: 6},
            baseSize: {type: Number, default: 3},
            color: {type: String, default: document.body.classList.contains('everlasting') ? 'white' : 'black'},
        },
        computed: {
            dot() {
                return this.baseSize;
            },
            space() {
                return this.baseSize;
            },
            dash() {
                return this.baseSize * 2;
            },
            longDash() {
                return this.baseSize * 4;
            },
            html() {
                let stroke = '';

                if (this.lineStyle === 'none') {
                    return this.i18n.noLineTitle;
                }

                switch (this.lineStyle) {
                    case 'dot':
                        stroke = [this.dot, this.space];
                        break;

                    case  'long-dash-dot-dot':
                        stroke = [this.longDash, this.space, this.dot, this.space, this.dot, this.space];
                        break;

                    case 'dash-dot':
                        stroke = [this.longDash, this.space, this.dot, this.space];
                        break;

                    case 'dash':
                        stroke = [this.dash, this.space];
                        break;

                    case 'solid':
                        // no dasharray needed
                        return this.getSVG();

                    default:

                }
                if (stroke) {
                    stroke = stroke.map(x => x + '%');
                    stroke = 'stroke-dasharray:' + stroke;
                    return this.getSVG(stroke);
                }

                return this.lineStyle;
            },
        },
        methods: {
            getSVG(svg) {
                return `<svg height="${this.height}" width="100%"><g fill="none">` +
                    `<line x1="0%" y1="50%" x2="100%" y2="50%" style="stroke: ${this.color}; stroke-width: ${this.height}px; ${svg}" />` +
                    '</g></svg>';
            },
        },
    };
</script>
