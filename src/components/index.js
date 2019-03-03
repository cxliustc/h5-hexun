import {ToastPlugin} from 'vux';
import Vue from 'vue';
import Scroll from './scroll/index';
import Loading from './loading/loading';
import ElementUI from 'element-ui';
Vue.use(ToastPlugin);
Vue.use(ElementUI);
export default {
    Scroll,
    Loading
};