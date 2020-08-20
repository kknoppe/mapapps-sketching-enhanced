<template>
    <div>
        <span> {{label}}</span>
        <v-menu
            v-model="menu"
            :close-on-content-click="true"
            offset-y
            full-width
        >
            <template v-slot:activator="{ on }">
                <v-btn icon
                       v-on="on">
                    <point-shape v-if="type === 'point'" :shape="shape"></point-shape>
                    <line-style v-else-if="type === 'line'" :lineStyle="shape"></line-style>
                </v-btn>
            </template>
            <point-shape-picker v-if="type ==='point'" v-model="pattern"></point-shape-picker>
            <line-style-picker v-if="type === 'line'" v-model="pattern"></line-style-picker>
        </v-menu>
    </div>
</template>

<script>

    import PointShape from '../../../dn_sketchingenhanced-symboleditor/components/symbol/point/PointShape.vue'
    import PointShapePicker from '../../../dn_sketchingenhanced-symboleditor/components/symbol/point/PointShapePicker.vue';
    import LineStyle from '../../../dn_sketchingenhanced-symboleditor/components/symbol/line/LineStyle.vue'
    import LineStylePicker from '../../../dn_sketchingenhanced-symboleditor/components/symbol/line/LineStylePicker.vue';

    export default {
        components: {
            LineStylePicker,
            LineStyle,
            PointShapePicker,
            PointShape,
        },
        data() {
            return {
                menu: false,
            };
        },
        props: {
            type: String,
            label: String,
            shape: String,
        },
        computed: {
            pattern: {
                get() {
                    return this.shape;
                },
                set(val) {
                    this.$emit('update:shape', val);
                },
            }
        }

    }

</script>
