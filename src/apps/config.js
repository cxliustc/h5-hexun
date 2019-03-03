// 所有业务线的共同配置文件
import Vue from 'vue';
import VueRouter from 'vue-router';
// import Vuex from 'vuex';

import createLogger from 'vuex/dist/logger';
import App from './index.vue';
// 加载自定义组件
// import 'COMPONENTS';
import httpConfig from 'UTILS/httpConfig';
import 'UTILS/filters';
import {isPrd, judeType, getIn} from 'UTILS/utils';

import {clearRequest} from 'UTILS/middlewares';
import {sync} from 'vuex-router-sync';

import 'vux/src/styles/reset.less';
import '../common/index.less';
import '../assets/icon/iconfont.css';
export let Router = null;

// Vue.mixin({
//     methods: {
//         getIn
//     }
// });
// Vue.use(Vuex);
// 开发环境下的vuex的logger
const logger = createLogger({
    collapsed: false,
    transformer (state) {
        return state;
    },
    mutationTransformer (mutation) {
        return mutation.type;
    }
});

export let store = null;

// 暴露出去的启动api
export default function ({router = {}, stores, urlTables}) {
    Vue.use(VueRouter);

    Router = new VueRouter({
        mode: 'hash',
        routes: router.routes
    });

    // store = new Vuex.Store({
    //     modules: {
    //         ...stores
    //     },
    //     strict: !isPrd(),
    //     plugins: isPrd() ? [] : [logger]
    // });

    // window.router = Router;

    // Router.beforeEach((to, from, next) => {
    //     clearRequest();
    //     // store.commit('system/resetLoadingStatus');
    //     store.commit('system/updateLoadingStatus', true);
    //     next();
    // });

    // Router.afterEach((to) => {
    //     store.commit('system/updateLoadingStatus', false);
    // });

    // if (router.beforeEach) {
    //     router.beforeEach.forEach(f => {
    //         if (judeType(f, '[object Function]')) {
    //             Router.beforeEach(f);
    //         }
    //     });
    // }

    // App.store = store;

    // 将router放在vux中进行管理
    // sync(store, Router, {moduleName: 'RouteModule'});

    httpConfig(urlTables);
    new Vue({
        router: Router,
        render: c => c(App)
    }).$mount('#root');
    // return store;
}
