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
                    {{ textStyleShort }}
                </v-btn>
            </template>
            <text-style-picker style="overflow: hidden" :styles="styles" :active.sync="currentTextStyle" :i18n="i18n"></text-style-picker>
        </v-menu>
    </v-layout>
</template>

<script>

    import TextStylePicker from '../text/TextStylePicker.vue';

    export default {
        components: {
            TextStylePicker,
        },
        data() {
            return {
                menu: false,
                styles: ['bold', 'italic'],
            };
        },
        props: {
            label: String,
            textStyle: Object,
            i18n: {type:Object},
        },
        computed: {
            currentTextStyle: {
                get() {
                    return this.textStyle;
                },
                set(val) {
                    this.$emit('update:textStyle', val);
                },
            },
            textStyleShort() {
                const output = [];
                this.styles.forEach(x => {
                    if (this.textStyle[x]) {
                        output.push(x.substr(0, 1).toUpperCase());
                    }
                });
                const value = output.join(', ');
                if(value) {
                    return value;
                }
                return 'N';
            },
        }

    }

</script>
