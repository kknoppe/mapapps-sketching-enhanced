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
    <v-item-group class="text-style-picker">
        <v-list>
            <v-item active-class="active" v-for="(item, index) in styles" :key="index">
                <v-list-tile @click="toggle" slot-scope="{ toggle }">
                    <text-style-checkbox :class="item" :label="i18nStyles[index]"
                                         :active.sync="active[item]"></text-style-checkbox>
                </v-list-tile>
                <v-divider></v-divider>
            </v-item>
        </v-list>
    </v-item-group>
</template>
<script>


    import TextStyleCheckbox from './TextStyleCheckbox.vue';

    export default {
        components: {
            TextStyleCheckbox,
        },
        props: {
            i18n: Object,
            active: Object,
            styles: Array,
        },

        data() {
            return {
                i18nStyles: [this.i18n.bold, this.i18n.italic, this.i18n.underlined],
            };
        },
    };
</script>
