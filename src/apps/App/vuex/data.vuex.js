// import apis from '../apis/api';
// 资讯详情模块的vuex
export default {
    namespaced: true,
    state: {
        pullingFlag: 1
    },
    getters: {
        getIsFirstPage ({pageCount}) {
            return pageCount === 0;
        }
    },
    mutations: {
        setPullingFlag (state, payload) {
            state.pullingFlag = payload;
        }
    }
};