// 接口的例子
import callApi from 'UTILS/httpUtils';
const GET_LIST = Symbol('GET_LIST');
class Data {
    getList (params) {
        return callApi({
            params,
            api: GET_LIST,
            method: 'post',
            request: params || {},
            waiting: true,
            endpoint: 'https://pre.bldz.com/sociality/cms/queryInformationList'
        });
    }
};
export default new Data();
