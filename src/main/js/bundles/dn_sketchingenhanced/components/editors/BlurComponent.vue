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
            offset-y
            full-width
        >
            <template v-slot:activator="{ on }">
                <v-btn icon
                       v-on="on"
                      :style="`background-color: ${backgroundColor}`">
                </v-btn>
            </template>
            <text-blur-picker :color.sync="blurColor" :radius.sync="blurRadius" :i18n="i18n"></text-blur-picker>
        </v-menu>
    </v-layout>
</template>

<script>

    import TextBlurPicker from '../text/TextBlurPicker.vue';

    export default {
        components: {
            TextBlurPicker,
        },
        data() {
            return {
                menu: false,
            };
        },
        props: {
            label: String,
            color: Object,
            radius: Number,
            i18n: Object,
        },
        computed: {
            blurColor: {
                get() {
                    return this.color;
                },
                set(val) {
                    this.$emit('update:color', val);
                },
            },
            blurRadius: {
                get() {
                    return this.radius;
                },
                set(val) {
                    this.$emit('update:radius', val);
                },
            },
            backgroundColor() {
                if(this.color) {
                    return `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
                }
            }
        }

    }

</script>
