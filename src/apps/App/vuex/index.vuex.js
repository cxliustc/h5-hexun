export default {
    namespaced: true,
    state: {
        pageCount: 0,
        keyword: '',
        noResultShow: false,
        currentKeyWord: ''
    },
    getters: {
        getIsFirstPage ({pageCount}) {
            return pageCount === 0;
        }
    },
    mutations: {
        setPageCount (state, count) {
            state.pageCount = count;
        },
        updateKeyWord (state, keyword) {
            state.keyword = keyword;
        },
        updateNoResultShow (state, status) {
            state.noResultShow = status;
        },
        updateCurrentKeyWord (state, keyword) {
            state.currentKeyWord = keyword;
        }
    }
};
