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
    <v-layout row class="sizeSliderLayout">
        <v-flex grow pa-1>
            <v-slider
                :label="labeling"
                v-model="extent"
                :max=max
                :min="min"
                thumb-label="always"
                :thumb-size="20"
                hide-details>
            </v-slider>
        </v-flex>
        <v-flex shrink pa-1>
            <v-layout row wrap class="textFieldSlider">
                <!-- single line number text field with rules to validate the input -->
                <v-text-field
                    class="sliderNumberText"
                    shrink
                    :min="min"
                    :max="max"
                    v-model="extent"
                    single-line
                    :rules="[rules.small, rules.big, rules.wrong]">
                </v-text-field>
                <!-- Arrows to increase or decrease the v-model of the slider and the input of the textfield -->
                <!-- manual add of these controls because MS EDGE does not support controls of v-text-field -->
                <v-layout column class="upDownControl">
                    <v-icon @click="increment" class="arrowUp">keyboard_arrow_up</v-icon>
                    <v-icon @click="decrement" class="arrowDown">keyboard_arrow_down</v-icon>
                </v-layout>
            </v-layout>

        </v-flex>

    </v-layout>
</template>

<script>
    import i18n from 'dojo/i18n!../../nls/bundle';

    export default {
        props: {
            // Slider label (if existing)
            label: String,
            // line or point size
            size: Number,
            // maximum and minimum size
            max: Number,
            min: Number,
            // step size which slider should allow
            step: Number,
            // point or line -> necessary to set label if this is not given
            type: String,
            i18n: {
                type: Object,
                // default i18n
                default: () => i18n.ui.input.sizeslider,
            },
        },
        computed: {
            extent: {
                get() {
                    // get the size current size
                    return this.size;
                },
                set(val) {
                    // validate the input and emit an event, that the size has changed
                    const value = this._validateInput(val);
                    this.$emit('update:size', value);
                },
            },
            labeling() {
                // add a label to the slider if it is not already existing
                // differ between point and line
                let label = this.label;
                if (!label) {
                    if (this.type === 'point') {
                        label = this.i18n.pointRadiusSliderLabel;
                    } else if (this.type === 'line') {
                        label = this.i18n.lineWeightSliderLabel;
                    } else {
                        label = '';
                    }
                }
                return label;
            },
        },
        data() {
            return {
                rules: {
                    // set rules, so that error messages can be shown if wrong numbers or characters are typed in
                    // in the textfield
                    small: value => value >= this.min || this.i18n.errorSmall.toString(),
                    big: value => value <= this.max || this.i18n.errorBig.toString(),
                    wrong: value => !isNaN(parseInt(value, 10)) || this.i18n.errorNumbers.toString(),
                },
            };
        },
        methods: {
            _validateInput(input) {
                // validate the input -> values cannot be bigger than maximum or smaller than minimum
                // if input is not a number the minimum is used
                const value = parseInt(input, 10);
                if (isNaN(value)) {
                    return this.min;
                }
                if (value > this.max) {
                    this.extent = this.max;
                    return this.max;
                } else if (value < this.min) {
                    this.extent = this.min;
                    return this.min;
                } else {
                    return value;
                }
            },
            increment() {
                // increment the v-model if arrow up is clicked
                this.extent++;
            },
            decrement() {
                // decrement the v-model if arrow down is clicked
                this.extent--;
            },
        },

    };
</script>
