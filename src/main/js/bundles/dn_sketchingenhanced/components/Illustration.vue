<template>
    <div>
        <point-editor v-if="type === 'point'" :settings.sync="symbolSettings"></point-editor>
        <line-editor v-else-if="type === 'polyline'" :settings.sync="symbolSettings"></line-editor>
        <text-editor v-else-if="type === 'text'" :settings.sync="symbolSettings"></text-editor>
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
            type() {
                if(this.tool && this.tool.type) {
                    this.newType = this.tool.type;
                }
                return this.newType;
            },
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
