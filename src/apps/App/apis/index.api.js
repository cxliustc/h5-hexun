// 接口的例子
import callApi from 'UTILS/httpUtils';
const GET_DATA = Symbol('GET_DATA');
class Index {
    getData (params) {
        return callApi({
            params,
            api: GET_DATA
        });
    }
    getData1 (params) {
        return callApi({
            params,
            api: GET_DATA
        });
    }
    getData2 (params) {
        return callApi({
            params,
            api: GET_DATA
        });
    }
};
export default new Index();
