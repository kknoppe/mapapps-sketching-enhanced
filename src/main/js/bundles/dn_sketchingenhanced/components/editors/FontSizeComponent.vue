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
                    {{ fontSize }}
                </v-btn>
            </template>
            <text-size-picker style="height: 150px; overflow: auto" :sizes="sizes" v-model="textSize"></text-size-picker>
        </v-menu>
    </v-layout>
</template>

<script>

    import TextSizePicker from '../text/TextSizePicker.vue';

    export default {
        components: {
            TextSizePicker,
        },
        data() {
            return {
                menu: false,
                sizes: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72, 84, 96, 100],
            };
        },
        props: {
            label: String,
            fontSize: Number,
            i18n: Object,
        },
        computed: {
            textSize: {
                get() {
                    return this.fontSize;
                },
                set(val) {
                    this.$emit('update:fontSize', val);
                },
            },
        }

    }

</script>
