export function isObject(o) {
    return typeof o === 'object' && o !== null;
}
export function isString(s) {
    return typeof s === 'string';
}
export function isFunction(f) {
    return typeof f === 'function';
}
export function isRegExp(r) {
    return r instanceof RegExp;
}
export function polyfillListener() {
    if (typeof window.addEventListener === 'function') {
        return;
    }
    window.addEventListener = function (type, listener) {
        let wrapper = function (e) {
            e.target = e.srcElement;
            e.currentTarget = window;
            listener.call(window, e);
        };
        window.attachEvent('on' + type, wrapper);
    };
}
export function safeParse(json, defaultValue = null) {
    if (!isString(json) || !json.length) {
        return defaultValue;
    }
    try {
        return JSON.parse(json);
    }
    catch (e) {
        console.error(e, json);
        return defaultValue;
    }
}
