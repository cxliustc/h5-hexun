import testRouter from './test.router';
import commodity from './commodity.router';
import infoRouter from './info.router';
export default [
    ...testRouter,
    ...commodity,
    ...infoRouter
];