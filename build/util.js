export function errorInfo(e) {
    console.error("[Front-Monitor Error]: " + e);
}
export function isObject(o) {
    return typeof o === 'object' && o !== null;
}
export function isString(o) {
    return typeof o === 'string';
}
// export function isArray(o: any): boolean {
//     return Array.isArray(o)
// }
function isAll(o) {
    return /^all$/i.test(o);
}
export function isSameErrorEvent(prev, next) {
    return prev.type === next.type && prev.colno === next.colno && prev.lineno === next.lineno && prev.filename === next.filename && prev.message === next.message;
}
export var isSameOrigin = (function () {
    var origin = window.location.protocol + "//" + document.domain + (window.location.port ? ':' + window.location.port : '');
    return function (fileUrl) {
        return fileUrl.indexOf(origin) === 0;
    };
})();
export var genErrorInfoFunc = function (fields) { return function (errorInfo) {
    var reportInfo = Object.create(null);
    fields.forEach(function (f) {
        reportInfo[f] = errorInfo[f] || '';
    });
    reportInfo.timestamp = Date.now();
    reportInfo.type = errorInfo.custom_type;
    return reportInfo;
}; };
export var isXHRErrorFunc = function (flag) { return function (status) {
    status += '';
    if (isString(flag)) {
        if (isAll(flag)) {
            return flag !== '200';
        }
        return flag.split('/').indexOf(status) > -1;
    }
    else if (flag instanceof RegExp) {
        return flag.test(status);
    }
    return false;
}; };
