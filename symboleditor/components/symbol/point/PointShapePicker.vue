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
    <v-item-group mandatory v-model="selectedItem" class="point-shape-picker">
        <v-list>
            <v-item active-class="active" :value="item" v-for="(item, index) in shapes" :key="index">
                <v-list-tile @click="toggle" slot-scope="{ toggle }">
                    <v-layout align-center style="font-size: 20px">
                        <point-shape :shape="item"></point-shape>
                    </v-layout>
                </v-list-tile>
                <v-divider></v-divider>
            </v-item>
        </v-list>
    </v-item-group>
</template>
<script>
    import PointShape from './PointShape.vue';

    export default {
        components: {
            PointShape,
        },

        props: {
            value: String,
        },

        data() {
            return {
                shapes: ['x', 'square', 'cross', 'circle', 'triangle', 'diamond'],
            };
        },

        computed: {
            selectedItem: {
                get() {
                    return this.value;
                },
                set(value) {
                    this.$emit('input', value);
                },
            },
        },
    };
</script>
