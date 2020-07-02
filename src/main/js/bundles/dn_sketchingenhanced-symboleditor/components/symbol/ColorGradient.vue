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
    <v-select
        :items="colorPathList"
        v-model="selectedValue"
        :label="i18n.colorGradientLineSelectorLabel"
        class="colorGradientSelect"
        item-value="value"
        menu-props="auto"
        hide-details
        v-bind="$attrs"
        clearable>
        <template slot="selection" slot-scope="data">
            <div v-bind:class=data.item.cssClass></div>
        </template>
        <template slot="item" slot-scope="data">
            <div v-bind:class=data.item.cssClass
            ></div>
        </template>
    </v-select>
</template>

<script>

    export default {
        props: {
            i18n: {type: Object, default: () => ({})},
            value: null,
        },

        data() {
            return {
                colorPathList: [
                    {startingColor: 'green', lastColor: 'red', value: 0, cssClass: 'greenToRedGradient',},
                    {startingColor: 'green', lastColor: 'yellow', value: 1, cssClass: 'greenToYellowGradient',}],
            };
        },

        computed: {
            /**
             * Implement v-model
             */
            selectedValue: {
                get() {
                    return this.value;
                },

                set(selectedValue) {
                    this.$emit('input', selectedValue);
                },
            },
        },
    };
</script>
