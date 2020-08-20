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
    <div>
        <span>Füllfarbe</span>
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
            <color-picker v-model="color"></color-picker>

        </v-menu>
    </div>
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
            color: {
                get() {
                    return this.settings.color
                },
                set(val) {
                    this.$emit('update:settings.color', val);
                    console.log(val);
                },
            },
            backgroundColor() {
                if(this.settings && this.settings.color) {
                    return `rgba(${this.settings.color.r}, ${this.settings.color.g}, ${this.settings.color.b}, ${this.settings.color.a})`;
                }
            }
        },
        props: {
            settings: Object,
        }
    }
</script>
