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
                       v-on="on">
                    {{ angle }}
                </v-btn>
            </template>
            <text-angle-picker :angle.sync="textAngle" :i18n="i18n"></text-angle-picker>
        </v-menu>
    </v-layout>
</template>

<script>

    import TextAnglePicker from '../text/TextAnglePicker.vue';

    export default {
        components: {
            TextAnglePicker,
        },
        data() {
            return {
                menu: false,
            };
        },
        props: {
            label: String,
            angle: Number,
            i18n: Object,
        },
        computed: {
            textAngle: {
                get() {
                    return this.angle;
                },
                set(val) {
                    this.$emit('update:angle', val);
                },
            },
        }

    }

</script>
