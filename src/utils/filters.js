// 公共使用的filters
import Vue from 'vue';
import {getTime, getPrdType} from 'UTILS/utils';

// 区分挂牌的label type
Vue.filter('announceTypeLabel', function (value) {
    switch (value) {
        case '10':
            return '挂牌';
        case '20':
            return '竞价';
        case '40':
            return '预售';
        case '50':
            return '拼团';
        default:
            return '';
    }
});

// 区分支付方式的filter
Vue.filter('paywayType', function (value) {
    return value;
});

// 时间
Vue.filter('newdate', function (value) {
    return getTime(value);
});
// 时间-分钟
Vue.filter('minute', function (str, n) {
    const num = parseInt(n);
    return str.split(' ')[num];
});
// 分割以：连接多个参数的string
Vue.filter('valStr', function (str, n) {
    const num = parseInt(n);
    return str.split(':')[num];
});
// 根据提供时间计算倒计时
Vue.filter('countDown', function (str) {
    const dateStr = new Date(str).getTime();
    const timeNow = new Date().getTime();
    const countDown = dateStr - timeNow;
    const countDownDay = Math.floor((dateStr - timeNow) / 86400000);// 计算剩余天数
    const countDownHour = Math.floor((dateStr - timeNow) / 3600000 % 24);// 计算剩余小时
    const countDownMin = Math.floor((dateStr - timeNow) / 60000 % 60);// 计算剩余分钟
    // const countDownSec = Math.floor((dateStr - timeNow) / 1000 % 60);// 计算剩余秒
    if (countDown <= 0) {
        return '- - - -';
    } else {
        return countDownDay + '天' + countDownHour + '小时' + countDownMin + '分钟';
    }
});
// 取绝对值
Vue.filter('numberFn', function (numberStr) {
    return Math.abs(numberStr);
});
// 处理图片地址的filter
Vue.filter('imgSrc', function (src) {
    const env = getPrdType();
    switch (env) {
        case 'pre':
            return `https://preres.bldz.com/${src}`;
        case 'pro':
            return `https://res.bldz.com/${src}`;
        case 'test':
        default:
            return `https://testimg.bldz.com/${src}`;
    }
});
// 直接转化剩余时间
Vue.filter('dateShow', function (dateStr) {
    const countDownDay = Math.floor(dateStr / 86400);// 计算剩余天数
    const countDownHour = Math.floor(dateStr / 3600 % 24);// 计算剩余小时
    const countDownMin = Math.floor(dateStr / 60 % 60);// 计算剩余分钟
    // const countDownSec = Math.floor((dateStr - timeNow) / 1000 % 60);// 计算剩余秒
    if (dateStr <= 0) {
        return '- - - -';
    } else if (countDownDay <= 0 && countDownHour <= 0) {
        return countDownMin + '分钟';
    } else if (countDownDay <= 0) {
        return countDownHour + '小时' + countDownMin + '分钟';
    } else {
        return countDownDay + '天' + countDownHour + '小时' + countDownMin + '分钟';
    }
});
// 处理图片
Vue.filter('imgLazy', function (src) {
    return {
        src,
        error: '../static/images/load-failure.png',
        loading: '../static/images/default-picture.png'
    };
});
Vue.filter('imgHandler', function (src) {
    return src.replace(/,jpg/g, '.jpg');
});