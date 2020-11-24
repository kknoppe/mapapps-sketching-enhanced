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
    <v-layout wrap row>
        <v-checkbox color="primary" v-model="active" :label="label"></v-checkbox>
        <v-text-field
            v-model="currentProperty"
            :suffix="suffix"
            step="1"
            type="number"
            :rules="[rules.required]"
            single-line>
        </v-text-field>

        <v-layout column class="upDownControlConstruction">
            <v-icon @click="increment" class="arrowUpConstruction">keyboard_arrow_up</v-icon>
            <v-icon @click="decrement" class="arrowDownConstruction">keyboard_arrow_down</v-icon>
        </v-layout>
    </v-layout>
</template>


<script>

    export default {
        data() {
            return {
                key: 1,
                rules: {
                    // set rules, so that error messages can be shown in the textfield
                    required: value => !!value || this.i18n.rules.required.toString(),
                },
            };
        },
        props: {
            constructionModel: {
                type: Object,
            },
            setting: {
                type: String,
            },
            label: {
                type: String,
            },
            i18n: {
                type: Object,
            },
        },
        computed: {
            active: {
                get() {
                    return this.constructionModel.use[this.setting];
                },
                set(value) {
                    let use = null;
                    if (this.setting === 'angleModulus') {
                        use = Object.assign({}, this.constructionModel.use, {angleModulus: value})
                    } else if (this.setting === 'radius') {
                        use = Object.assign({}, this.constructionModel.use, {radius: value})
                    } else if (this.setting === 'planarLength') {
                        use = Object.assign({}, this.constructionModel.use, {planarLength: value})
                    }
                    this.constructionModel.set('use', use);
                },
            },
            currentProperty: {
                get() {
                    return this.key && this.constructionModel[this.setting];
                },
                set(value) {
                    const val = this._validateInput(value);
                    this.constructionModel.set(this.setting, val);
                },
            },
            suffix() {
                return (this.setting === 'angleModulus') ? '°' : 'm';
            },
        },
        methods: {
            _validateInput(input) {
                // validate the input
                // if input is not a number the previous value is used
                const value = parseInt(input, 10);
                if (isNaN(value)) {
                    return this.constructionModel[this.setting];
                }
                return value;
            },
            increment() {
                // increment the v-model if arrow up is clicked
                this.currentProperty++;
                // update key, so that currentProperty can be updated correctly
                this.key++;
            },
            decrement() {
                // decrement the v-model if arrow down is clicked
                this.currentProperty--;
                // update key, so that currentProperty can be updated correctly
                this.key++;
            },
        },
    };
</script>
