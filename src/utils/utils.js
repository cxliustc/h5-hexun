// 常用的工具api

const test = 'test';
const pre = 'pre';
const pro = 'pro';
console.log(test + pre + pro);

export function judeType (param, typeString) {
    if (Object.prototype.toString.call(param) === typeString) return true;
    return false;
};

export function isPrd () {
    return process.env.NODE_ENV === 'production';
};

export function getPrdType () {
    return ENV;
};

export const ls = {
    put (key, value) {
        if (!key || !value) return;
        window.localStorage[key] = JSON.stringify(value);
    },
    get (key) {
        if (!key) return null;
        const tem = window.localStorage[key];
        if (!tem) return null;
        return JSON.parse(tem);
    },
    // 设置cookie
    setCookie (key, value, time) {
        if (time) {
            if (typeof time === 'object') {
                document.cookie = key + '=' + value + ';expires=' + time.toGMTString() + ';path=/';
            } else {
                let date = new Date();
                date.setDate(date.getDate() + time);
                document.cookie = key + '=' + value + ';expires=' + date.toGMTString() + ';path=/';
            }
        } else {
            document.cookie = key + '=' + value + ';path=/';
        }
    },
    // 获取cookie
    getCookie (key) {
        let array = document.cookie.split('; ');
        let keyValue = '';
        array.map(val => {
            let [valKey, value] = val.split('=');
            if (valKey === key) {
                keyValue = decodeURI(value);
            }
        });
        return keyValue;
    }
};

/**
 * 判断元素有没有该class
 * @param {*} el
 * @param {*} className
 */

export function hasClass (el, className) {
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
    return reg.test(el.className);
}
/**
 * 为元素添加class
 * @param {*} el
 * @param {*} className
 */
export function addClass (el, className) {
    if (hasClass(el, className)) return;
    let newClass = el.className.spilt(' ');
    newClass.push(className);
    el.className = newClass.join(' ');
}

export function removeClass (el, className) {
    if (!hasClass(el, className)) return;

    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)', 'g');
    el.className = el.className.replace(reg, ' ');
}

/**
 * 将数据存储在标签里
 * @param {*} el
 * @param {*} name
 * @param {*} val
 */
export function getData (el, name, val) {
    let prefix = 'data-';
    if (val) {
        return el.setAttribute(prefix + name, val);
    }
    return el.getAttribute(prefix + name);
}

export function isIphone () {
    return window.navigator.appVersion.match(/iphone/gi);
}

/**
 * 计算元素和视窗的位置关系
 * @param {*} el
 */
export function getRect (el) {
    if (el instanceof window.SVGElement) {
        let rect = el.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        };
    } else {
        return {
            top: el.offsetTop,
            left: el.offsetLeft,
            width: el.offsetWidth,
            height: el.offsetHeight
        };
    }
}

/**
 * 获取不确定数据的方法api
 * @param {Array} p 参数数组
 * @param {Object} o 对象
 */
export function getIn (p, o) {
    return p.reduce(function (xs, x) {
        return (xs && xs[x]) ? xs[x] : null;
    }, o);
}

/**
 * 时间戳改为年月日格式时间
 * @param {*} p 时间戳
 */
export function getTime (p) {
    let myDate = new Date(p);
    let year = myDate.getFullYear();
    let month = myDate.getMonth() + 1;
    let date = myDate.getDate();
    if (month >= 10) {
        month = '' + month;
    } else {
        month = '0' + month;
    }

    if (date >= 10) {
        date = '' + date;
    } else {
        date = '0' + date;
    }
    return year + '-' + month + '-' + date;
}
// 时间戳格式化
export function formatDate (date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
        }
    }
    return fmt;
}

export function debounce (method, delay) {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            method.apply(context, args);
        }, delay);
    };
}

function padLeftZero (str) {
    return ('00' + str).substr(str.length);
}
