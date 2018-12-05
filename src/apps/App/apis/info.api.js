// 接口的例子
import callApi from 'UTILS/httpUtils';
import {getUrl} from 'UTILS/httpConfig';
const GET_INFO_DETAILDATA = Symbol('GET_INFO_DETAILDATA');
const GET_INFO_DETAILRECOMMENDDATA = Symbol('GET_INFO_DETAILRECOMMENDDATA');
class Info {
    getInfoDetailData (params) {
        return callApi({
            method: 'post',
            endpoint: getUrl('sociality/cms/infoDetail'),
            request: params,
            api: GET_INFO_DETAILDATA
        });
    }
    getInfoDetailRecommendData (params) {
        return callApi({
            method: 'post',
            endpoint: getUrl('sociality/cms/seoRelevantInfo'),
            request: params,
            api: GET_INFO_DETAILRECOMMENDDATA
        });
    }
};
export default new Info();
