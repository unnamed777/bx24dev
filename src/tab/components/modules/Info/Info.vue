<template>
    <div>
        <h5>app.info</h5>
        <table class="table table-sm table-hover">
            <tbody>
                <tr v-for="(value, key) of this.info">
                    <td class="w-25">{{ key }}</td>
                    <td>{{ value }}</td>
                </tr>
            </tbody>
        </table>

        <h5>scope</h5>
        <table class="table table-sm table-hover">
            <tbody>
                <tr v-for="value of this.scope">
                    <td>{{ value }}</td>
                </tr>
            </tbody>
        </table>

        <h5>methods</h5>
        <table class="table table-sm table-hover">
            <tbody>
                <tr v-for="value of this.methods">
                    <td>{{ value }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions} from 'vuex';
import BX24 from 'lib/BX24';
import TableList from 'components/TableList/BaseTableList.vue';

export default {
    components: {
        TableList,
    },

    data() {
        return {
            info: {},
        };
    },

    computed: mapState({
        scope: state => state.scope,
        methods: state => state.availableMethods,
    }),

    mounted() {
        this.prepareData();
    },

    methods: {
        async prepareData() {
            this.setBreadcrumb(['Информация']);
            this.info = await BX24.fetch('app.info');
        },

        ...mapMutations({
            setBreadcrumb: 'setBreadcrumb',
        }),
    }
};
</script>
