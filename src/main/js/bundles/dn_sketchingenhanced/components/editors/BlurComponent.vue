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
                       v-on="on"
                      :style="`background-color: ${backgroundColor}`">
                </v-btn>
            </template>
            <text-blur-picker :color.sync="blurColor" :radius.sync="blurRadius" :i18n="i18n"></text-blur-picker>
        </v-menu>
    </div>
</template>

<script>

    import TextBlurPicker from '../text/TextBlurPicker.vue';

    export default {
        components: {
            TextBlurPicker,
        },
        data() {
            return {
                menu: false,
            };
        },
        props: {
            label: String,
            color: Object,
            radius: Number,
            i18n: Object,
        },
        computed: {
            blurColor: {
                get() {
                    return this.color;
                },
                set(val) {
                    this.$emit('update:color', val);
                },
            },
            blurRadius: {
                get() {
                    return this.radius;
                },
                set(val) {
                    this.$emit('update:radius', val);
                },
            },
            backgroundColor() {
                if(this.color) {
                    return `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.color.a})`;
                }
            }
        }

    }

</script>
