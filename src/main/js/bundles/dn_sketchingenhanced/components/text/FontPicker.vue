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
    <v-item-group mandatory v-model="selectedItem" class="font-picker">
        <v-list>
            <v-item active-class="active" :value="item" v-for="(item, index) in fonts" :key="index">
                <v-list-tile @click="toggle" slot-scope="{ toggle }">
                    <v-layout align-center style="font-size: 14px">
                        {{ item }}
                    </v-layout>
                </v-list-tile>
                <v-divider></v-divider>
            </v-item>
        </v-list>
    </v-item-group>
</template>
<script>


    export default {

        props: {
            value: String,
            fonts: Array,
        },

        data() {
            return {};
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
