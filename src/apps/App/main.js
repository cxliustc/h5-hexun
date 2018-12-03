// 项目的入口文件
import configApp from '../config';
import Routers from './router';
import stores from './vuex';
import {isPrd, getPrdType} from 'UTILS/utils';
// import {getPF} from './utils';

const cfg = {
    stores: stores,
    router: {
        routes: [...Routers]
    },
    urlTables () {
        const tables = {
            'default': '',
            test: 'test',
            pre: 'pre',
            pro: 'www'
        };
        if (isPrd()) {
            return tables[getPrdType()];
        } else {
            return {
                ...tables
            };
        }
    }
};
configApp(cfg);
