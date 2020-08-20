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
