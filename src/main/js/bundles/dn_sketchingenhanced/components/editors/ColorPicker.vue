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
        <span>{{label}}</span>
        <v-spacer></v-spacer>
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            offset-y
            full-width
        >
            <template v-slot:activator="{ on }">
                <v-btn icon
                       v-on="on"
                       :style="`background-color: ${backgroundColor}`"
                >
                </v-btn>
            </template>
            <color-picker v-model="pickerColor" :disable-alpha="disableAlpha"></color-picker>

        </v-menu>
    </v-layout>
</template>

<script>

    import {Chrome} from 'dn_vuecolor';

    export default {
        components: {
            'color-picker': Chrome,
        },
        data() {
            return {
                menu: false,
            }
        },
        computed: {
            pickerColor: {
                get() {
                    return this.color
                },
                set(val) {
                    this.$emit('update:color', val);
                },
            },
            backgroundColor() {
                if(this.color) {
                    return `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
                }
            }
        },
        props: {
            color: Object,
            label: String,
            disableAlpha: {
                type: Boolean,
                default: false
            },
        }
    }
</script>
