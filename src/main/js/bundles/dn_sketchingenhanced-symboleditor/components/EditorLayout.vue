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
    <v-card class="mt-2 editor-layout" color="grey lighten-2">
        <!-- Header -->
        <v-toolbar dense flat color="grey lighten-2">
            <v-toolbar-title class="primary--text subheading">{{ label }}</v-toolbar-title>
            <v-spacer></v-spacer>

            <!-- Visibility Toggle Switch -->
            <v-flex shrink align-center>
                <v-switch
                    hide-details
                    v-model="isActive"
                    color="primary"
                ></v-switch>
            </v-flex>
        </v-toolbar>

        <v-expand-transition>
            <v-card v-if="isActive" color="grey lighten-2">
                <v-card-text>
                    <!-- Main content -->
                    <slot></slot>
                </v-card-text>

                <!-- Footer -->
                <v-divider class="mt-2"></v-divider>
                <submit-discard
                    @submit="$emit('submit')"
                    @discard="$emit('discard')"
                    v-bind="actionProps"
                ></submit-discard>
            </v-card>
        </v-expand-transition>
    </v-card>
</template>

<script>
    import SubmitDiscard from './SubmitDiscard.vue';

    export default {
        components: {
            SubmitDiscard,
        },

        props: {
            label: {type: String},
            active: {type: Boolean, default: false},
            actionProps: {type: Object, default: () => ({})},
        },

        data() {
            return {isActive: this.active};
        },

        watch: {
            isActive(val) {
                this.$emit('update:active', val);
            },

            active(val) {
                this.isActive = val;
            },
        },
    };
</script>
