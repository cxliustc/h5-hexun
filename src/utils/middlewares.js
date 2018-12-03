import UUID from 'uuid-js';
// import {getToken} from 'UTILS';
// import {loginOut} from 'VUEX/actions';
// import {message} from 'COMPONENTS';
import Vue from 'vue';
import {Router} from '../apps/config';

// 处理loading
import {addLoading, reduceLoading} from '../apps/App/vuex/commit';

// 处理超时的中间件
const TIME_OUT = 10000;
export const CALL_API = Symbol('CALL_API');
const IGNORE_ID = Symbol('IGNORE_ID');
const IGNORE_RACE = Symbol('IGNORE_RACE');
// const NOT_IGNORE = Symbol('NOT_IGNORE');
export const ignoreRequestCache = {}; // 存储所有请求的cache
const lastRaceRequest = {}; // 存储每一类请求的最新的请求

// 注销请求
export const clearRequest = () => {
    Object.keys(ignoreRequestCache).map(ignoreId => {
        ignoreRequestCache[ignoreId].status = 'ignore';
    });
};

const message = Vue.prototype.toast;

const createUUId = () => UUID.create().toString();

function _timeout (req, next) {
    if (req.timeout === 0) {
        next();
        return;
    }
    const timer = setTimeout(function () {
        req.abort();
        const {[CALL_API]: {[IGNORE_ID]: ignoreId, api}} = req;
        if (ignoreRequestCache[ignoreId].status !== 'ignore') {
            message({
                type: 'error',
                showClose: true,
                message: '请求超时'
            });
        } else {
            delete lastRaceRequest[api];
        }
        delete ignoreRequestCache[ignoreId];
    }, req.timeout || TIME_OUT);

    next(() => {
        clearTimeout(timer);
    });
};

// function addToken (req) {
//     const token = getToken();
//     token && req.headers.set('token', token + '');
// };

function handleReq (req, next) {
    req.headers.set('Content-Type', 'application/json;charset=utf-8');
    req.headers.set('api-ver', '5.26');
    // req.headers.set('mimeType', 'multipart/form-data')
    // addToken(req);
    // debugger;
    // if (req.loading) addLoading();
    // 对请求的参数进行处理
    if (req.method === 'GET') {
        req[CALL_API] = req.params[CALL_API];
        delete req.params[CALL_API];
    } else {
        if (req.body.formData) {
            req[CALL_API] = req.body[CALL_API];
            delete req.body[CALL_API];
            req.body = req.body.formData;
        } else {
            req[CALL_API] = req.body[CALL_API];
            delete req.body[CALL_API];
        }
    }

    if (req[CALL_API].loading) addLoading();

    next((response) => {
        if (req[CALL_API].loading) reduceLoading();
        if (response.status === 401) {
            // 代表登录超时，需要重新登录
            // loginOut();
            Router.push({
                name: 'login'
            });
            return false;
        } else {
            if (response.status !== 200 && response.status !== 0) {
                // let msg = '请求失败！';
                // if (response.status === 404) msg = '找不到服务器地址';
                // if (response.body && response.body.msg) msg = response.body.msg;
                // message({
                //     type: 'error',
                //     showClose: true,
                //     message: msg
                // });
            } else if (!response.body.success || !response.body.data) {
                // message({
                //     type: 'error',
                //     showClose: true,
                //     message: '返回数据不正确'
                // });
            }
        }
    });
};

// 包装请求
const wrapRequest = (request, next) => {
    let {[CALL_API]: callApi} = request;
    callApi[IGNORE_RACE] = callApi[IGNORE_RACE] || true;
    callApi[IGNORE_ID] = callApi[IGNORE_ID] || createUUId();
    next();
};

const ignoreRequest = (request, next) => {
    const {[CALL_API]: callApi} = request;
    const {api, [IGNORE_ID]: ignoreId, [IGNORE_RACE]: ignoreRace} = callApi;
    // 新请求先储存在ignoreRequestCache中
    if (typeof ignoreRequestCache[ignoreId] === 'undefined') {
        ignoreRequestCache[ignoreId] = {
            status: 'waiting',
            originRequest: {
                ...request
            }
        };
    }
    // 查看请求是不是竞赛请求
    if (ignoreRace) {
        const type = api;
        lastRaceRequest[type] = lastRaceRequest[type] || {};
        // 如果lastRaceRequest[type].type存在说明不是该种类型的请求首次发起
        if (lastRaceRequest[type].type) {
            const origin = ignoreRequestCache[lastRaceRequest[type].ignoreId];
            if (origin && origin.status !== 'ignore') origin.status = 'ignore';
        }
        if (lastRaceRequest[type].ignoreId !== ignoreId) {
            lastRaceRequest[type] = {
                type,
                ignoreId
            };
        }
    }

    next(response => {
        // 清理lastRaceRequest
        if (ignoreRace) {
            let type = api;
            lastRaceRequest[type] = lastRaceRequest[type] || {};
            if (lastRaceRequest[type].ignoreId === ignoreId) {
                // 代表是最后的请求已经归来
                delete lastRaceRequest[type];
                // raceStatus表示这是最后一个请求
                if (ignoreRequestCache[ignoreId] && ignoreRequestCache[ignoreId].status !== 'ignore') {
                    response.raceStatus = true;
                }
            }
        }

        if (ignoreRequestCache[ignoreId]) {
            delete ignoreRequestCache[ignoreId];
        }
        return response;
    });
};

// vue-resource的中间件调用顺序是反向的
export default [ignoreRequest, wrapRequest, _timeout, handleReq];
