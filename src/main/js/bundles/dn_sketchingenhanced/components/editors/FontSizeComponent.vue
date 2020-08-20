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
                    {{ fontSize }}
                </v-btn>
            </template>
            <text-size-picker style="height: 150px; overflow: auto" :sizes="sizes" v-model="textSize"></text-size-picker>
        </v-menu>
    </div>
</template>

<script>

    import TextSizePicker from '../text/TextSizePicker.vue';

    export default {
        components: {
            TextSizePicker,
        },
        data() {
            return {
                menu: false,
                sizes: [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72, 84, 96, 100],
            };
        },
        props: {
            label: String,
            fontSize: Number,
            i18n: Object,
        },
        computed: {
            textSize: {
                get() {
                    return this.fontSize;
                },
                set(val) {
                    this.$emit('update:fontSize', val);
                },
            },
        }

    }

</script>
