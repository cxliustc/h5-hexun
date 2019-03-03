import Vue from 'vue';
import {CALL_API} from './middlewares';
// import {toQueryString} from './StringUtil';

const httpRequest = async function (options) {
    let {endpoint = '', method = 'get', request = {}} = options;
    delete options['endpoint'];
    delete options['method'];
    delete options['request'];
    // delete options['formData'];
    // delete options['loading'];
    let res = await query({
        endpoint,
        method,
        params: request,
        options
    });

    let {raceStatus} = res;
    if (!raceStatus) {
        // return Promise.reject('race');
        throw new Error('race');
    }
    if (!res.body) {
        throw new Error('return data is error');
    }
    return res;
};

async function query ({method, endpoint, params, options}) {
    let res;
    // 普通接口功能
    if (method === 'get') {
        // 修复打包后的bug
        res = await Vue.http.get(endpoint, {
            params: {
                ...params,
                [CALL_API]: options
            }
        }, {
            emulateJSON: false
        });
        return res;
    } else {
        // 修复打包后的bug
        params = {
            ...params,
            [CALL_API]: options
        };
        res = await Vue.http[method](endpoint, params, {
            emulateJSON: false
        });
        return res;
    }
};

/*
 * @method callApi
 * @params options Object
 * {
 *      endpoint, 请求的路径 string
 *      api, 请求的标识符 Symbol
 *      request, 请求的参数  Object
 *      waiting, 是否显示出加载图标 boolen
 * }
 */

const callApi = function (options) {
    let request;
    try {
        request = httpRequest(options);
    } catch (error) {
        return Promise.reject(error);
    }
    return request;
};

export default callApi;
