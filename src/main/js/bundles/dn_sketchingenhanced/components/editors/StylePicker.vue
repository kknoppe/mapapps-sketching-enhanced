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
                    <point-shape :shape="shape"></point-shape>
                </v-btn>
            </template>
            <point-shape-picker v-model="pattern"></point-shape-picker>

        </v-menu>
    </div>
</template>

<script>

    import PointShape from '../../../dn_sketchingenhanced-symboleditor/components/symbol/point/PointShape.vue'
    import PointShapePicker from '../../../dn_sketchingenhanced-symboleditor/components/symbol/point/PointShapePicker.vue';

    export default {
        components: {
            PointShapePicker,
            PointShape,
        },
        data() {
            return {
                menu: false,
            };
        },
        props: {
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
