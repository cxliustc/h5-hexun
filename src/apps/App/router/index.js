import testRouter from './test.router';
<<<<<<< HEAD
import commodity from './commodity.router';
import infoRouter from './info.router';
export default [
    ...testRouter,
    ...commodity,
=======
import dataRouter from './data.router';
import infoRouter from './info.router';
export default [
    ...testRouter,
    ...dataRouter,
>>>>>>> b8168343370bd1b6d93d3ef83b2faa241dc2feb0
    ...infoRouter
];