// 接口的例子
import callApi from 'UTILS/httpUtils';
import {getUrl} from 'UTILS/httpConfig';
const GET_INFO_DETAILDATA = Symbol('GET_INFO_DETAILDATA');// 资讯详情正文Verification Code
const GET_INFO_DETAILRECOMMENDDATA = Symbol('GET_INFO_DETAILRECOMMENDDATA');// 相关推荐
const GET_INFO_VERIFICATIONCODE = Symbol('GET_INFO_VERIFICATIONCODE');// 获取短信验证码
const GET_INFO_SUBMITCODE = Symbol('GET_INFO_SUBMITCODE');// 相关推荐
class Info {
    getInfoDetailData (params) {
        return callApi({
            method: 'post',
            endpoint: getUrl('sociality/cms/getInfoDetail'), // sociality/cms/getInfoDetail
            request: params,
            api: GET_INFO_DETAILDATA
        });
    }
    getInfoDetailRecommendData (params) {
        return callApi({
            method: 'post',
            endpoint: getUrl('sociality/cms/getRelatedInfo'), // sociality/cms/getRelatedInfo
            request: params,
            api: GET_INFO_DETAILRECOMMENDDATA
        });
    }
    getVerificationCode (params) {
        return callApi({
            method: 'post',
            endpoint: getUrl('hexun-portal/user/verification/code/get'),
            request: params,
            api: GET_INFO_VERIFICATIONCODE
        });
    }
    submitCode (params) {
        return callApi({
            method: 'post',
            endpoint: getUrl('hexun-portal/user/verification/code/record'),
            request: params,
            api: GET_INFO_SUBMITCODE
        });
    }
};
export default new Info();
