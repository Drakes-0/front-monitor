const config = {
    appId: 'fm-unnamed',
    reportFields: ['colno', 'lineno', 'filename', 'message'],
    sameOrigin: true,
    distinct: true,
    cacheKey: 'FrontMonitorCache',
    cacheLimit: 50,
    bufferTime: 5000,
    bufferSize: 10,
    xhrErrorLevel: 'ALL',
    xhrErrorMessage: 'message',
    catchUnhandledRejection: true
};
var ERROR_TYPE;
(function (ERROR_TYPE) {
    ERROR_TYPE["RUNTIME"] = "RUNTIME";
    ERROR_TYPE["RESOURCE"] = "RESOURCE";
    ERROR_TYPE["UNHANDLEDREJECTION"] = "UNHANDLEDREJECTION";
    ERROR_TYPE["XMLHTTPREQUEST"] = "XMLHTTPREQUEST";
})(ERROR_TYPE || (ERROR_TYPE = {}));
export { config as default, ERROR_TYPE };
