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
    <v-toolbar dense pa-0 class="SketchingToolsBar">
        <div v-for="(tool,index) in tools" :key="index">
            <tool-button :tool="tool" @onToolClick="$emit('onToolClick', $event)" :id="tool.id"></tool-button>
        </div>
    </v-toolbar>
</template>

<script>

    import ToolButton from './ToolButton.vue';

    export default {
        components: {
            ToolButton,
        },
        props: {
            tools: Array,
        }
    }

</script>
