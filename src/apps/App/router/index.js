// import testRouter from './test.router';
// import commodity from './commodity.router';
// import infoRouter from './info.router';
// import dataRouter from './data.router';
import Subscribe from '../views/subscribe/Subscribe.vue'
import Date from '../views/date/Date.vue'
import Default from '../views/default/Default.vue'
import Login from '../views/login/Login.vue'
import Check from '../views/check/Check.vue'
import Order from '../views/order/index.vue'
import ChooseStore from '../views/choose-store/index.vue'
import Address from '../views/add-address/index.vue'
export default [
    // ...testRouter,
    // ...commodity,
    // ...infoRouter,
    // ...dataRouter, 
    // {
    //     path: '/subscribe',
    //     name: 'subscribe',
    //     component: Subscribe
    // }, {
    //     path: '/date/:id',
    //     name: 'date',
    //     component: Date
    // }, {
    //     path: '/default',
    //     component: Default
    // }, 
    {
        path: '/login',
        component: Login
    }, {
        path: '/hexiao',
        component: Check,
        name: 'check'
    }, {
        path: '/order',
        component: Order,
        name: 'order'
    }, {
        path: '/choose-store',
        component: ChooseStore,
        name: 'chooseStore'
    }, {
        path: '/address',
        component: Address,
        name: 'address'
    }
];