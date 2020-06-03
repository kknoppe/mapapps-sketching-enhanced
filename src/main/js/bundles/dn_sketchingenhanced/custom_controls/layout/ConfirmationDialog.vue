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
    <v-dialog v-model="show" max-width="500px" persistent class="confirmation-dialog">
        <v-card>
            <v-card-title class="headline">
                <slot name="header">Title</slot>
                <v-spacer></v-spacer>
            </v-card-title>

            <v-card-text>
                <slot></slot>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" flat @click.stop="$emit('confirm')">
                    <slot name="confirm">Ok</slot>
                </v-btn>
                <v-btn color="primary" flat @click.stop="abort">
                    <slot name="abort">Cancel</slot>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

    export default {
        name: 'ConfirmationDialog',

        data() {
            return {
                show: false,
            };
        },

        methods: {
            /**
             * Cancels the alert
             */
            abort() {
                this.show = false;
                this.$emit('abort');
                this.$off('confirm');
            },

            /**
             * Ask the user to confirm the alert
             * @returns {Promise<any>}
             */
            ask() {
                this.show = true;
                return new Promise((resolve, reject) => {
                    this.$on('confirm', () => {
                        this.show = false;
                        resolve();
                    });

                    this.$on('abort', () => {
                        this.show = false;
                        reject('abort');
                    });
                });
            },
        },
    };
</script>
