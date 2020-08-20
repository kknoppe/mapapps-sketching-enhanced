<template>
    <div>
        <span> {{label}}</span>
        <v-menu
            v-model="menu"
            :close-on-content-click="false"
            offset-y
            full-width
        >
            <template v-slot:activator="{ on }">
                <v-btn icon
                       v-on="on">
                    {{ angle }}
                </v-btn>
            </template>
            <text-angle-picker :angle.sync="textAngle" :i18n="i18n"></text-angle-picker>
        </v-menu>
    </div>
</template>

<script>

    import TextAnglePicker from '../text/TextAnglePicker.vue';

    export default {
        components: {
            TextAnglePicker,
        },
        data() {
            return {
                menu: false,
            };
        },
        props: {
            label: String,
            angle: Number,
            i18n: Object,
        },
        computed: {
            textAngle: {
                get() {
                    return this.angle;
                },
                set(val) {
                    this.$emit('update:angle', val);
                },
            },
        }

    }

</script>
