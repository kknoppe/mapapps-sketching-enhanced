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
    <v-expand-transition>
        <v-container class="expansion-page vue-base pa-0">
            <v-layout class="full-height">
                <v-layout column class="page">
                    <!-- header -->
                    <v-flex shrink>
                        <v-toolbar dense card class="white--text" color="primary">
                            <v-toolbar-title>
                                <slot name="header"></slot>
                            </v-toolbar-title>
                        </v-toolbar>
                    </v-flex>

                    <!-- main section -->
                    <v-flex grow class="main-section">
                        <v-container>
                            <slot></slot>
                        </v-container>
                    </v-flex>

                    <!-- footer -->
                    <v-spacer></v-spacer>
                    <v-flex column shrink>
                        <v-divider></v-divider>
                        <v-layout fluid justify-end row>
                            <slot name="footer"></slot>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-layout>
        </v-container>
    </v-expand-transition>
</template>

<script>
    export default {
        name: 'Page',
    };
</script>
