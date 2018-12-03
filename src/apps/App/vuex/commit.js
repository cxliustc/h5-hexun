import {store} from '../../config';

export function addLoading () {
    store.commit('system/updateLoadingStatus', true);
}

export function reduceLoading () {
    store.commit('system/updateLoadingStatus', false);
}