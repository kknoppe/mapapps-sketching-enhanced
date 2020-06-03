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
    <v-btn-toggle v-model="active" active-class="btnGroupSingleSymbol"
                  class="grey lighten-2 elevation-3">
        <!-- color -->
        <editor-button
                :active="active === 0"
                icon="brush"
                :color="settings.color"
                :tooltip="i18n.colorPickerLineTooltip"></editor-button>

        <!-- style -->
        <editor-button
                :active="active === 1"
                icon="line_style"
                :tooltip="i18n.lineStyleSelectorTooltip">
            <line-style style="line-height: 0"
                        :base-size="10"
                        :height="8"
                        :lineStyle="settings.style"></line-style>
        </editor-button>

        <!-- width -->
        <editor-button
                :active="active === 2"
                icon="line_weight"
                type="text"
                :tooltip="i18n.lineWeightSliderLabel">
            <span class="text-preview">{{ settings.width }}</span>
        </editor-button>
    </v-btn-toggle>
</template>

<script>
    import EditorButton from '../EditorButton.vue';
    import LineStyle from './LineStyle.vue';

    export default {
        components: {
            EditorButton,
            LineStyle,
        },

        props: {
            i18n: {type: Object, default: () => ({})},
            settings: {type: Object, required: true},
            activeTab: Number,
        },

        data() {
            return {
                active: this.activeTab,
            };
        },

        watch: {
            active(val) {
                this.$emit('update:activeTab', val);
            },

            activeTab(val) {
                this.active = val;
            },
        },
    };
</script>
