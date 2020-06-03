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
    <v-layout>
        <v-select
            v-model="scale"
            v-if="!editEnabled"
            v-bind="{ items, label, disabled }"
            :rules="rules"
            :no-data-text="noDataText"
        >
            <template slot="item" slot-scope="data">1:{{ data.item.toLocaleString(countryCode) }}</template>
            <template slot="selection" slot-scope="data">1:{{ data.item.toLocaleString(countryCode) }}</template>
        </v-select>
        <v-combobox
            v-model="scaleAsText"
            v-if="editEnabled"
            v-bind="{ label, disabled }"
            :items="itemsForSelection"
            ref="select"
            prefix="1:"
            :rules="rules"
            :no-data-text="noDataText"
            @keypress="checkInput"
            @click:append="_toggleMenu"
        >
            <template slot="item" slot-scope="data">1:{{ data.item }}</template>
        </v-combobox>
    </v-layout>
</template>

<script>
    export default {
        name: 'ScaleSelect',

        props: {
            // language file
            countryCode: { type: String, default: () => navigator.userLanguage },
            // Indicates if multiple files can be processed
            items: { type: Array, required: true },
            label: { type: String, required: false },
            value: { type: Number, required: true },
            editEnabled: { type: Boolean, required: false, default: true },
            disabled: { type: Boolean, required: false },
            rules: { type: Array, required: false },
            noDataText: { type: String, required: false },
        },

        data() {
            return { scaleValue: this.value };
        },

        methods: {
            /**
             * A bug in this Vuetify version leads to the possibility to append one character after the mask.
             * This function implements the mask function manually
             */
            checkInput(e) {
                const code = e.which ? e.which : e.keyCode;
                if (!(code > 31 && (code < 48 || code > 57))) {
                    // valid input
                    return true;
                }

                this.error = true;
                setTimeout(() => (this.error = false), 2000);
                e.preventDefault();
                return false;
            },

            /**
             * Closes the menu
             **/
            closeMenu() {
                // lose focus
                this.$refs.select && this.$refs.select.blur();
            },

            /**
             * Changes the state of the menu.
             * Shows it when it's closed and closes it when it's open
             * @private
             */
            _toggleMenu() {
                if (!this.$refs.select.isMenuActive) {
                    // set focus to the select-box and activate the menu
                    this.$refs.select.focus();
                    this.$refs.select.activateMenu();
                } else {
                    // close the menu
                    this.closeMenu();
                }
            },

            // FIXME - Dies wird in LayoutForm._getIntValue dupliziert. Beide sollten ausgelagert werden und eine eigene Komponente bilden.
            _getIntValue(formattedValue) {
                if (typeof formattedValue === 'number') {
                    return formattedValue;
                }

                const withoutSeparators = formattedValue
                    .toLocaleString(this.countryCode)
                    .replace(this._thousandsRegExp, '');
                const intValue = parseInt(withoutSeparators, 10);

                return intValue;
            },
        },

        computed: {
            _thousandsRegExp: {
                get() {
                    const referenceValue = 1000;
                    let sepChar = referenceValue.toLocaleString(this.countryCode).charAt(1);
                    if (sepChar === '.') {
                        sepChar = '\\\.';
                    }

                    return new RegExp(sepChar, 'g');
                },
            },

            scale: {
                get() {
                    return this.value;
                },

                set(scale) {
                    this.$emit('input', scale);
                },
            },

            scaleAsText: {
                get() {
                    const intValue = this._getIntValue(this.scaleValue);

                    return isNaN(intValue) ? this.scaleValue : intValue.toLocaleString(this.countryCode);
                },

                set(scale) {
                    const intValue = this._getIntValue(scale);
                    this.scaleValue = scale;

                    this.$emit('input', intValue);
                },
            },

            itemsForSelection: {
                /**
                 * Returns all possible values for the scale
                 * @returns {String[]}
                 */
                get() {
                    let selectableItems = (this.items || []).slice();
                    const intValue = this._getIntValue(this.scaleValue);

                    // The list contains all items and possibly one custom scale (selection of user)
                    if (this.scaleValue && !selectableItems.includes(intValue)) {
                        selectableItems = selectableItems.concat([intValue]);
                    }

                    // Sort the list
                    selectableItems.sort((x, y) => x - y);

                    return selectableItems.map(x => x.toLocaleString(this.countryCode));
                },
            },
        },

        watch: {
            value() {
                // close the menu when the value has changed
                this.$nextTick(this.closeMenu);
                this.scaleValue = this.value;
            },
        },
    };
</script>
