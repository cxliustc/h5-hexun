export function isPhone (phoneNum) {
    let phone = /^1([38]\d|4[57]|5[0-35-9]|7[06-8]|8[89])\d{8}$/;
    if (!phone.test(phoneNum)) {
        return false;
    } else {
        return true;
    }
}
export function isNumber (Num) {
    let phone = /^[0-9]*$/;
    if (!phone.test(Num)) {
        return false;
    } else {
        return true;
    }
}
export function isNull (str) {
    return (str === '' || str === undefined || str === null);
}

export function removeByValue (arr, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            arr.splice(i, 1);
            break;
        }
    }
}

export function toQueryString (obj) {
    var ret = [];
    for (var key in obj) {
        key = encodeURIComponent(key);
        let values = obj[key];
        ret.push(toQueryPair(key, values));
    }
    return ret.join('&');
}

function toQueryPair (key, value) {
    if (typeof value === 'undefined') {
        return key;
    }
    return key + '=' + encodeURIComponent(value === null ? '' : String(value));
}
