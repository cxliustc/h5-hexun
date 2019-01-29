// import testRouter from './test.router';
// import commodity from './commodity.router';
// import infoRouter from './info.router';
// import dataRouter from './data.router';
import Subscribe from '../views/subscribe/Subscribe.vue'
import Date from '../views/date/Date.vue'
export default [
    // ...testRouter,
    // ...commodity,
    // ...infoRouter,
    // ...dataRouter, 
    {
        path: '/subscribe',
        name: 'subscribe',
        component: Subscribe
    }, {
        path: '/date',
        name: 'date',
        component: Date
    }
];