import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
    routes
});

const removeInitGuard = router.beforeEach((to, from, next) => {
    // 1. Add callback function to root Vue instance
    // 2. Wait for getting b24 auth
    // 3. If auth is successfully obtained, fire callback
    // 4. Remove the guard when callback after firing callback. We need it just once
    console.log('beforeEach', from, to);

    // If some module is requested, wait till auth is obtained and route it it afterwards.
    if (to.name === 'index') {
        removeInitGuard();
        console.log('Guard removed');
        next();
        return;
    }

    router.app.onReadyToRoute = () => {
        console.log('onReadyToRoute fired');
        console.log('Guard removed');
        removeInitGuard();
        next();
    };
});

export default router;
