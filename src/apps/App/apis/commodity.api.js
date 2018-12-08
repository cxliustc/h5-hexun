// 接口的例子
import callApi from 'UTILS/httpUtils';
import {getUrl} from 'UTILS/httpConfig';
const GET_STOCKINDEXDATA = Symbol('GET_STOCKINDEXDATA');
const GET_CLASSIFYDATA = Symbol('GET_CLASSIFYDATA');
const GET_CONTENTDATA = Symbol('GET_CONTENTDATA');
class Info {
    stockindexdata (params) {
        return callApi({
            method: 'post',
            endpoint: 'http://192.168.98.43:8815/cms/getStockIndexData',
            request: params,
            api: GET_STOCKINDEXDATA
        });
    }
    classifydata (params) {
        return callApi({
            method: 'post',
            endpoint: 'http://192.168.98.43:8815/cms/hexun/data/config/queryGoodsCategoryList',
            request: params,
            api: GET_CLASSIFYDATA
        });
    }
    contentdata (params) {
        return callApi({
            method: 'post',
            endpoint: getUrl('hexun-portal/user/verification/code/get'),
            request: params,
            api: GET_CONTENTDATA
        });
    }
};
export default new Info();
