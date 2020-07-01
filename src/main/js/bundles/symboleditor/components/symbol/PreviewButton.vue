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
    <v-btn class="uniqueValueBtn" :class="type" @click="$emit('click')">
        <!-- point -->
        <svg v-if="type === 'point'" width="100%" height="100%" v-html="point"></svg>

        <!-- line -->
        <line-style v-if="type === 'line'" :lineStyle="symbol.style" :color="colorToCSS(symbol.color)"
                    :base-size="10"></line-style>

        <!-- polygon -->
        <template v-if="type === 'polygon'">
            <fill-style class="polygon-fill" :color="colorToCSS(symbol.color)" :fill-style="symbol.style"
                        :height="25"></fill-style>
            <line-style class="polygon-outline" :lineStyle="symbol.outline.style"
                        :color="colorToCSS(symbol.outline.color)" :base-size="10"></line-style>
        </template>
    </v-btn>
</template>

<script>
    import CSSColor from '../mixins/CSSColor';
    import PointShape from './point/PointShape.vue';
    import AsciiPoint from '../mixins/AsciiPoint';
    import LineStyle from './line/LineStyle.vue';
    import FillStyle from './polygon/FillStyle.vue';

    export default {
        mixins: [AsciiPoint, CSSColor],

        components: {
            FillStyle,
            LineStyle,
            PointShape,
        },

        props: {
            symbol: {type: Object, required: true},
        },

        computed: {
            type() {
                if (this.symbol.typeName === 'PointSetting') {
                    return 'point';
                }

                if (this.symbol.typeName === 'LineSetting') {
                    return 'line';
                }

                if (this.symbol.typeName === 'PolygonSetting') {
                    return 'polygon';
                }

                return '';
            },

            point() {
                let svg = '';
                if (this.symbol.url) {
                    return `<image xlink:href="${this.symbol.url}" height="100%" width="100%"></image>`;
                }

                const baseSize = this.getBaseSize();


                const size = baseSize - (this.symbol.outline.width * 5);
                const ascii = this.getAsciiForPointShape(this.symbol.shape);
                if (!['cross', 'x'].includes(this.symbol.shape)) {
                    // show outline
                    svg += `<text x="50%" y="20" text-anchor="middle" font-size="${baseSize}" fill="${this.colorToCSS(this.symbol.outline.color)}">${ascii}</text>`;
                    svg += `<text x="50%" y="${20 - this.symbol.outline.width}" text-anchor="middle" font-size="${size}" fill="white">${ascii}</text>`;
                }
                svg += `<text x="50%" y="${20 - this.symbol.outline.width}" text-anchor="middle" font-size="${size}" fill="${this.colorToCSS(this.symbol.color)}">${ascii}</text>`;

                return svg;
            },
        },

        methods: {
            getBaseSize() {
                switch (this.symbol.shape) {
                    case 'circle':
                    case 'square':
                        return 36;
                    case 'diamond':
                    case 'triangle':
                        return 24;
                    case 'cross':
                    case 'x':
                    default:
                        return 26;
                }
            },
        },
    };
</script>
