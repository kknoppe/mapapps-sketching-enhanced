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
    <editor-layout
            :label="i18n.title"
            :active.sync="enabled"
            :actionProps="{submittable: submittable && !settings.warning, discardable: submittable, submitLabel: i18n.submit, discardLabel: i18n.discard}"
            @submit="applySettings"
            @discard="discardSettings">

        <v-flex>
            <v-alert :value="settings.warning" type="error" transition="scale-transition"
                     class="py-1 mb-2 caption">
                {{ i18n.layerLabelingWarning }}
            </v-alert>
        </v-flex>

        <v-checkbox v-model="visible" :label="i18n.visible"></v-checkbox>

        <v-select
                :label="i18n.select_field"
                :items="sortedFields"
                item-value="name"
                v-model="fieldForLabeling"
                :menu-props="{'content-class': 'visualisationEditor-menu'}"
                :no-data-text="i18n.noFieldsForLabeling">
            <template v-slot:item="{item, index}">
                <v-layout column class="px-3" :class="itemClass(item)">
                    {{displayName(item)}}
                </v-layout>
            </template>
            <template v-slot:selection="{item, index}">
                {{displayName(item)}}
            </template>
        </v-select>

        {{ scaleInfo }}
    </editor-layout>
</template>

<script>
    import kernel from 'dojo/_base/kernel';
    import string from 'dojo/string';
    import EditorLayout from '../EditorLayout.vue';

    export default {
        components: {
            EditorLayout,
        },

        data() {
            return {
                fields: [],
                enabled: false,
                visible: true,
                fieldForLabeling: '',
                locale: kernel.locale,
            };
        },

        props: {
            settings: Object,
            i18n: {type: Object, default: () => ({})},
            globalScales: Array,
        },

        computed: {
            submittable() {
                return this.fieldForLabeling !== this.settings.fieldForLabeling || this.visible !== this.settings.visible || !this.settings.enabled;
            },

            scaleInfo() {
                const min = (this.settings.minScale || '').toLocaleString(this.locale);
                const max = (this.settings.maxScale || '').toLocaleString(this.locale);
                const globalmax = ((this.globalScales && this.globalScales[0]) ? Math.max(...this.globalScales) : Infinity).toLocaleString(this.locale);
                const globalmin = ((this.globalScales && this.globalScales[0]) ? Math.min(...this.globalScales) : 1).toLocaleString(this.locale);

                if (min && max) {
                    return string.substitute(this.i18n.visible_scale_between, {
                        p1: `1:${min}` || '',
                        p2: `1:${max}` || '',
                    });
                }

                if (min) {
                    return string.substitute(this.i18n.visible_scale_between, {
                        p1: `1:${globalmin}` || '',
                        p2: `1:${min}` || '',
                    });
                }

                if (max) {
                    return string.substitute(this.i18n.visible_scale_between, {
                        p1: `1:${max}` || '',
                        p2: `1:${globalmax}` || '',
                    });
                }

                return string.substitute(this.i18n.visible_scale_between, {
                    p1: `1:${globalmin}` || '',
                    p2: `1:${globalmax}` || '',
                });
            },

            sortedFields() {
                const defaultField = this.settings.fields.find(x => this._isDefault(x));
                if (defaultField) {
                    return [defaultField, ...this.settings.fields.filter(x => !this._isDefault(x))];
                }

                return this.settings.fields;
            },
        },

        methods: {
            itemClass(field) {
                return this._isDefault(field) ? 'special-entry' : '';
            },
            displayName(field) {
                return this._isDefault(field) ? field.alias + ' (' + this.i18n.default_tag + ')' : field.alias;
            },
            _isDefault(field) {
                return field.name === this.settings.defaultField;
            },
            _loadFromSettings(settings) {
                this.enabled = settings.enabled;
                this.visible = settings.visible;
                this.fieldForLabeling = settings.fieldForLabeling;
            },
            applySettings() {
                this.$emit('apply', {
                    ...this.settings,
                    enabled: this.enabled,
                    visible: this.visible,
                    fieldForLabeling: this.fieldForLabeling,
                });
            },

            discardSettings() {
                this._loadFromSettings(this.settings);
            },
        },

        mounted() {
            this._loadFromSettings(this.settings);
        },

        watch: {
            settings(newSettings) {
                this._loadFromSettings(newSettings);
            },
            enabled(value) {
                if (!value) {
                    this.applySettings();
                }
            },
        },
    };
</script>
