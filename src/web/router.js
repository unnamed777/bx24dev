import { createRouter, createWebHashHistory } from "vue-router";
import LoginPage from "@web/components/LoginPage.vue";
import AppPage from "@web/components/AppPage.vue";
import appRoutes from "@app/router/routes";

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

const router = createRouter({
    routes
});

export default router;