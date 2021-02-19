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
    <v-layout wrap row class="text-angle-picker">
        <span class="text-angle-label">{{i18n.angle}}</span>

        <v-text-field
            v-model="rotation"
            :suffix="suffix"
            :rules="[rules.required, rules.tooSmall, rules.tooBig]"
            single-line>
        </v-text-field>

        <v-layout column class="text-angle-upDownControl">
            <v-icon @click="increment" class="arrowUpTextAngle">keyboard_arrow_up</v-icon>
            <v-icon @click="decrement" class="arrowDownTextAngle">keyboard_arrow_down</v-icon>
        </v-layout>
    </v-layout>
</template>
<script>


    export default {
        data() {
            return {
                min: 0,
                max: 360,
                rules: {
                    // set rules, so that error messages can be shown in the textfield
                    required: value => !(isNaN(value)) || this.i18n.rules.number.toString(),
                    tooSmall: value => value >= this.min || this.i18n.rules.tooSmall.toString(),
                    tooBig: value => value <= this.max || this.i18n.rules.tooBig.toString(),
                },
                suffix: '°',
            };
        },
        props: {
            angle: {
                type: Number,
            },
            i18n: {
                type: Object,
            },
        },
        computed: {
            rotation: {
                get() {
                    return this.angle;
                },
                set(value) {
                    const val = this._validateInput(value);
                    this.$emit('update:angle', val);
                },
            },
        },
        methods: {
            _validateInput(input) {
                // validate the input
                const value = parseInt(input, 10);
                if (isNaN(value)) {
                    return this.min;
                } else if (value < this.min) {
                    return this.min;
                } else if (value > this.max) {
                    return this.max;
                } else {
                    return value;
                }
            },
            increment() {
                // increment the v-model if arrow up is clicked
                this.rotation++;

            },
            decrement() {
                // decrement the v-model if arrow down is clicked
                this.rotation--;
            },
        },
    };
</script>
