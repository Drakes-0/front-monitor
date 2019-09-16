var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import defaultConfig from './defaultConfig';
import { errorInfo, isString, isObject, genErrorInfoFunc, isXHRErrorFunc } from './util';
import Reporter from './Reporter';
import ErrorStack from './ErrorStack';
import addEventListener from './addEventListener';
import hookXHR from './hookXHR';
(function (win) {
    if (typeof win === 'undefined') {
        return errorInfo('monitor need browser-like environment');
    }
    function FrontMonitor(config) {
        if (isString(config)) {
            config = {
                reportUrl: config
            };
        }
        if (!isObject(config) || !isString(config.reportUrl) || !config.reportUrl.length) {
            return errorInfo('invalid report url');
        }
        var conf = __assign({}, defaultConfig, config);
        var genErrorInfo = genErrorInfoFunc(conf.reportFields);
        var isXHRError = isXHRErrorFunc(conf.xhrErrorLevel);
        var reporter = new Reporter(conf.appId, conf.reportUrl);
        var stack = new ErrorStack(reporter, conf.distinct, conf.cacheKey, conf.cacheLimit, conf.bufferTime, conf.bufferSize);
        var catchErrorByCustomType = function (type) { return function (ee) {
            ee.custom_type = type;
            stack.push(genErrorInfo(ee));
        }; };
        addEventListener(win, catchErrorByCustomType, conf.sameOrigin, conf.catchUnhandledRejection);
        hookXHR(isXHRError, catchErrorByCustomType);
    }
    win.FrontMonitor = FrontMonitor;
})(window);
