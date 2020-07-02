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
    <v-tooltip top>
        <template v-slot:activator="{ on }">
            <v-btn class="btnGroupSingleSymbol py-2" flat v-on="on" large>
                <v-layout column wrap align-center justify-center class="ma-0">
                    <div class="main-icon">
                        <slot name="icon">
                            <v-icon>{{ icon }}</v-icon>
                        </slot>
                    </div>

                    <div class="preview" :class="{text: type==='text'}">
                        <slot>
                            <span class="color-preview" v-bind:style="{background: colorToCSS(color)}"></span>
                        </slot>
                    </div>
                    <v-icon class="iconMenuArrowDown"
                            :style="{visibility: active ? 'visible' : 'hidden'}"
                            style="height:12px">
                        arrow_drop_down
                    </v-icon>
                </v-layout>
            </v-btn>
        </template>
        <span>{{ tooltip }}</span>
    </v-tooltip>
</template>
<script>
    import CSSColor from '../mixins/CSSColor';

    export default {
        mixins: [CSSColor],

        props: {
            active: Boolean,
            color: Object,
            icon: String,
            type: String,
            tooltip: String,
        },
    };
</script>
