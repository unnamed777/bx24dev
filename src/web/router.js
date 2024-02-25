import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginPage from "@web/components/LoginPage.vue";
import AppPage from "@web/components/AppPage.vue";
import appRoutes from "@app/router/routes";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'login',
        component: LoginPage,
    },
    {
        path: '/:authId',
        name: 'app',
        component: AppPage,
        children: appRoutes,
    },
];

const router = new VueRouter({
    routes
});

export default router;