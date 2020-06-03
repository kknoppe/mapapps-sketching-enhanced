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
    <v-layout row class="quickfilter">
        <v-text-field
                ref="quickFilterTextfield"
                :label="i18n.label"
                prepend-icon="icon-filter"
                v-model="filterText"
                v-bind="{disabled}"
                autofocus
                clearable
        ></v-text-field>
    </v-layout>
</template>

<script>
    import i18n from 'dojo/i18n!../nls/bundle';

    export default {
        name: 'QuickFilter',
        props: {
            disabled: {type: Boolean, default: false},
            delay: {type: Number, default: 500},
            focus: {type: Boolean, default: false},
            // language file
            i18n: {
                type: Object,
                // default i18n
                default: () => i18n.ui.input.quickfilter,
            },
            // value of the component
            value: {type: String, required: false},
        },
        data() {
            return {
                timeOut: {},
            };
        },
        computed: {
            /**
             * Implement v-model
             */
            filterText: {

                get() {
                    return this.value;
                },

                set(filterText) {
                    // trigger delayed input event for v-model
                    clearTimeout(this.timeOut);
                    this.timeOut = setTimeout(() => {
                        this.$emit('input', filterText || '');
                    }, this.delay);
                },
            },
        },
        watch: {
            // trigger focus on the textfield from outside
            focus() {
                if (this.focus) {
                    this.$refs.quickFilterTextfield.focus();
                }
            },
        },
    };
</script>
