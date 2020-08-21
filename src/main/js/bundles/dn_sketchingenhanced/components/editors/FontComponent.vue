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
        <span> {{label}}</span>
        <v-menu
            v-model="menu"
            :close-on-content-click="true"
            offset-y
            full-width
        >
            <template v-slot:activator="{ on }">
                <v-btn icon
                       v-on="on">
                    {{ font }}
                </v-btn>
            </template>
            <font-picker :fonts="fonts" v-model="currentFont"></font-picker>
        </v-menu>
    </div>
</template>

<script>

    import FontPicker from '../text/FontPicker.vue';

    export default {
        components: {
            FontPicker,
        },
        data() {
            return {
                menu: false,
                fonts: ['Arial', 'Serif'],
            };
        },
        props: {
            label: String,
            font: String,
        },
        computed: {
            currentFont: {
                get() {
                    return this.font;
                },
                set(val) {
                    this.$emit('update:font', val);
                },
            }
        }

    }

</script>
