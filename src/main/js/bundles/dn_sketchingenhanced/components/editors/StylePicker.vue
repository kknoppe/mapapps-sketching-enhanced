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
    <v-layout row class="illustrationEntry">
        <span> {{label}}</span>
        <v-spacer></v-spacer>
        <v-menu
            v-model="menu"
            :close-on-content-click="true"
            offset-y
            full-width
        >
            <template v-slot:activator="{ on }">
                <v-btn icon
                       v-on="on">
                    <point-shape v-if="type === 'point'" :shape="shape"></point-shape>
                    <line-style v-if="type === 'line'" :lineStyle="shape"></line-style>
                    <fill-style v-if="type === 'polygon'" :fillStyle="shape"></fill-style>
                </v-btn>
            </template>
            <point-shape-picker v-if="type ==='point'" v-model="pattern"></point-shape-picker>
            <line-style-picker v-if="type === 'line'" v-model="pattern"></line-style-picker>
            <fill-style-picker v-if="type === 'polygon'" v-model="pattern"></fill-style-picker>
        </v-menu>
    </v-layout>
</template>

<script>

    import PointShape from '../../../dn_sketchingenhanced-symboleditor/components/symbol/point/PointShape.vue'
    import PointShapePicker from '../../../dn_sketchingenhanced-symboleditor/components/symbol/point/PointShapePicker.vue';
    import LineStyle from '../../../dn_sketchingenhanced-symboleditor/components/symbol/line/LineStyle.vue'
    import LineStylePicker from '../../../dn_sketchingenhanced-symboleditor/components/symbol/line/LineStylePicker.vue';
    import FillStyle from '../../../dn_sketchingenhanced-symboleditor/components/symbol/polygon/FillStyle.vue';
    import FillStylePicker from '../../../dn_sketchingenhanced-symboleditor/components/symbol/polygon/FillStylePicker.vue';

    export default {
        components: {
            FillStyle,
            FillStylePicker,
            LineStylePicker,
            LineStyle,
            PointShapePicker,
            PointShape,
        },
        data() {
            return {
                menu: false,
            };
        },
        props: {
            type: String,
            label: String,
            shape: String,
            i18n: {
                type: Object,
            }
        },
        computed: {
            pattern: {
                get() {
                    return this.shape;
                },
                set(val) {
                    this.$emit('update:shape', val);
                },
            }
        }

    }

</script>
