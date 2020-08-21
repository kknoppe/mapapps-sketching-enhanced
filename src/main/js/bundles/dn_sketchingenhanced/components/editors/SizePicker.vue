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
            :close-on-content-click="false"
        >
            <template v-slot:activator="{ on }">
                <v-btn icon
                       v-on="on">
                   <span>{{radius}}</span>
                </v-btn>
            </template>

            <size-slider
                label="_"
                :size.sync="radius"
                :max="max"
                :min="1"
                :type="type"
                :step="1">
            </size-slider>

        </v-menu>
    </v-layout>
</template>


<script>

    import SizeSlider from '../../../dn_sketchingenhanced-symboleditor/components/input/SizeSlider.vue';

    export default {
        components: {
            SizeSlider,
        },
        data() {
            return {
                menu: false,
            };
        },
        props: {
            type: String,
            label: String,
            size: Number,
            maxPointSize: Number,
        },
        computed: {
            radius: {
                get() {
                    return this.size;
                },
                set(val) {
                    this.$emit('update:size', val);
                },
            },
            max() {
               if(this.type === 'point') {
                   return this.maxPointSize;
               }
               if(this.type === 'line') {
                   return 10;
               }
            }
        }

    }

</script>
