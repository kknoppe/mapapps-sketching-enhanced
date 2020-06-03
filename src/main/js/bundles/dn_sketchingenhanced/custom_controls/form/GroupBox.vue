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
    <v-layout column>
        <h3>{{label}}</h3>
        <v-divider></v-divider>
        <div class="slot">
            <slot></slot>
        </div>
    </v-layout>
</template>
<script>
    export default {
        props: {
            label: { type: String, required: true },
        },
    };
</script>