// 接口的例子
import callApi from 'UTILS/httpUtils';
import {getUrl} from 'UTILS/httpConfig';
const GET_LIST = Symbol('GET_LIST');
const GET_DATAS = Symbol('GET_DATAS');
class Data {
    getList (params) {
        return callApi({
            params,
            api: GET_LIST,
            method: 'post',
            request: params || {},
            waiting: true,
            endpoint: getUrl('sociality/cms/getInfoList')
            // endpoint: 'http://192.168.98.76:8099/cms/getInfoList'
        });
    }
    getDatas (params) {
        return callApi({
            params,
            api: GET_DATAS,
            method: 'post',
            request: params || {},
            waiting: true,
            endpoint: getUrl('sociality/cms/getGoodsData')
            // endpoint: 'http://192.168.98.76:8815/cms/getGoodsData'
        });
    }
};
export default new Data();
