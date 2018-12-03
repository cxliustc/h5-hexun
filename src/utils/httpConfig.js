import Vue from 'vue';
import VueResource from 'vue-resource';
import callApi from './httpUtils';
import {isPrd, judeType} from './utils';
import middlewares from './middlewares';

Vue.use(VueResource);

function install (Vue) {
    Vue.prototype.callApi = callApi;
    for (let i = 0; i < middlewares.length; i++) {
        Vue.http.interceptors.push(middlewares[i]);
    }
};

Vue.use(install);

let URL_TABLES;

// 用来处理不同环境下的请求url
export function getUrl (url, type = 'test') {
    if (!isPrd()) {
        if (judeType(url, '[object Object]')) {
            const {mockUrl, mock, url} = url;
            if (mock) {
                return `/mock/${mockUrl}`;
            }
            if (url) {
                return `https://${URL_TABLES[type]}.bldz.com/${url}`;
            }
            window.console.log(`params one of mock and url must be useful!!!!`);
        } else {
            return `https://${URL_TABLES[type]}.bldz.com/${url}`;
            // return `http://192.168.98.90:9090/${url}`;
        }
    }
    return `https://${URL_TABLES}.bldz.com/${url}`;
};
// 员工管理系统处理不同环境下的请求url
export function manageUrl (url, type = 'test') {
    if (!isPrd()) {
        if (judeType(url, '[object Object]')) {
            const {url} = url;
            if (url) {
                return `http://traintest.bldz.com/${url}`;
            }
            window.console.log(`params one of mock and url must be useful!!!!`);
        } else {
            return `http://traintest.bldz.com/${url}`;
        }
    }
    return `http://train.bldz.com/${url}`;
};

Vue.use(Vue => {
    Vue.getUrl = getUrl;
    Vue.manageUrl = manageUrl;
});

export default function httpConfig (urlTables) {
    URL_TABLES = urlTables();
};
