import defaultConfig from './defaultConfig';
import { errorInfo, isString, isObject, genErrorInfoFunc, isXHRErrorFunc } from './util';
import Reporter from './Reporter';
import ErrorStack from './ErrorStack';
import addEventListener from './addEventListener';
import hookXHR from './hookXHR';
const FrontMonitor = (function (win) {
    if (typeof win === 'undefined') {
        return errorInfo('monitor need browser-like environment'), () => { };
    }
    return function FrontMonitor(config) {
        if (isString(config)) {
            config = {
                reportUrl: config
            };
        }
        if (!isObject(config) || !isString(config.reportUrl) || !config.reportUrl.length) {
            return errorInfo('invalid report url');
        }
        const conf = Object.assign({}, defaultConfig, config);
        const genErrorInfo = genErrorInfoFunc(conf.reportFields);
        const isXHRError = isXHRErrorFunc(conf.xhrErrorLevel);
        const reporter = new Reporter(conf.appId, conf.reportUrl);
        const stack = new ErrorStack(reporter, conf.distinct, conf.cacheKey, conf.cacheLimit, conf.bufferTime, conf.bufferSize);
        const catchErrorByCustomType = (type) => (ee) => {
            ee.custom_type = type;
            stack.push(genErrorInfo(ee));
        };
        addEventListener(win, catchErrorByCustomType, conf.sameOrigin, conf.catchUnhandledRejection);
        hookXHR(isXHRError, catchErrorByCustomType);
    };
})(window);
export default FrontMonitor;
