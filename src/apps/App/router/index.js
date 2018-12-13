import testRouter from './test.router';
import commodity from './commodity.router';
import infoRouter from './info.router';
import dataRouter from './data.router';
export default [
    ...testRouter,
    ...commodity,
    ...infoRouter,
    ...dataRouter
];