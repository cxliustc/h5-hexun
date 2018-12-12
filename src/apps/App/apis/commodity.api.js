// 接口的例子
import callApi from 'UTILS/httpUtils';
import {getUrl} from 'UTILS/httpConfig';
const GET_STOCKINDEXDATA = Symbol('GET_STOCKINDEXDATA');// 股指
const GET_CLASSIFYDATA = Symbol('GET_CLASSIFYDATA');// 列表
const GET_CONTENTDATA = Symbol('GET_CONTENTDATA');// 列表内容
const GET_BURYING = Symbol('GET_BURYING');// 埋点
class Info {
    stockindexdata (params) {
        return callApi({
            method: 'post',
            // endpoint: 'http://192.168.98.43:8815/cms/getStockIndexData',
            endpoint: getUrl('hexun-portal/cms/getStockIndexData'),
            request: params,
            api: GET_STOCKINDEXDATA
        });
    }
    classifydata (params) {
        return callApi({
            method: 'post',
            // endpoint: 'http://192.168.98.43:8815/cms/hexun/data/config/queryGoodsCategoryList',
            endpoint: getUrl('hexun-portal/cms/hexun/data/config/queryGoodsCategoryList'),
            request: params,
            api: GET_CLASSIFYDATA
        });
    }
    contentdata (params) {
        return callApi({
            method: 'post',
            // endpoint: 'http://192.168.98.43:8815/cms/queryProductDataList',
            endpoint: getUrl('hexun-portal/cms/queryProductDataList'),
            request: params,
            api: GET_CONTENTDATA
        });
    }
    burying (params) {
        return callApi({
            method: 'get',
            endpoint: getUrl('hexun-portal/data/collectPageRequest'),
            request: params,
            api: GET_BURYING
        });
    }
};
export default new Info();
