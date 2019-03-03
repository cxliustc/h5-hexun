export function isPhone (phoneNum) {
    let phone = /^1[34578]\d{9}$/;
    if (!phone.test(phoneNum)) {
        return false;
    } else {
        return true;
    }
}
export function isName (Name) {
    let iName = /^[a-zA-Z\u4e00-\u9fa5]+$/;
    if (!iName.test(Name)) {
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
