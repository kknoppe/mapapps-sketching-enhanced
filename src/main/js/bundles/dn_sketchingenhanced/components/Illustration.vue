<template>
    <div>
        <point-editor v-if="tool.type === 'point'" :settings.sync="symbolSettings"></point-editor>
        <line-editor v-else-if="tool.type === 'polyline'" :settings.sync="symbolSettings"></line-editor>
        <text-editor v-else-if="tool.type === 'text'" :settings.sync="symbolSettings"></text-editor>
        <polygon-editor v-else :settings.sync="symbolSettings"></polygon-editor>
    </div>
</template>

<script>

    import PointEditor from './editors/PointEditor.vue'
    import LineEditor from './editors/LineEditor.vue';
    import PolygonEditor from './editors/PolygonEditor.vue';
    import TextEditor from './editors/TextEditor.vue';

    export default {
        components: {
            PointEditor,
            LineEditor,
            PolygonEditor,
            TextEditor,
        },
        props: {
            settings: Object,
            tool: Object,
        },
        computed: {
            symbolSettings: {
                get() {
                    return this.settings;
                },
                set(val) {
                    this.$emit('update:settings', val)
                }
            }
        },
    }

</script>
