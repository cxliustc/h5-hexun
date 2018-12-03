export default {
    namespaced: true,
    state: {
        isLoading: 0,
        productCategoryLexicon: []
    },
    getters: {
        isLoading (state) {
            return !!state.isLoading;
        }
    },
    mutations: {
        updateLoadingStatus (state, isLoading) {
            if (isLoading) {
                state.isLoading++;
            } else {
                state.isLoading--;
            }
        },
        resetLoadingStatus (state) {
            state.isLoading = 0;
        },
        setProductCategoryLexicon (state, ProductCategoryLexicon) {
            state.productCategoryLexicon = ProductCategoryLexicon;
        }
    }
};