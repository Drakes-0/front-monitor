import { ERROR_TYPE } from './defaultConfig';
import { isObject, isSameOrigin } from './util';
export default function (win, catchErrorByCustomType, sameOrigin, catchUnhandledRejection) {
    var catchRuntimeError = catchErrorByCustomType(ERROR_TYPE.RUNTIME);
    var catchResourceError = catchErrorByCustomType(ERROR_TYPE.RESOURCE);
    var handler = function (ee) {
        if (ee.target === win) {
            if (!sameOrigin || isSameOrigin(ee.filename)) {
                catchRuntimeError(ee);
            }
        }
        else if (ee.target instanceof HTMLElement) {
            catchResourceError({
                colno: 0,
                lineno: 0,
                filename: ee.target.src || ee.target.href,
                message: "load " + ee.target.tagName + " resource failed"
            });
        }
    };
    win.addEventListener('error', handler, true);
    if (catchUnhandledRejection) {
        var catchUnhandledRejectionError_1 = catchErrorByCustomType(ERROR_TYPE.UNHANDLEDREJECTION);
        var unhandledRejectionHandler = function (ee) {
            var message = isObject(ee.reason) ? ee.reason.stack : ee.reason;
            catchUnhandledRejectionError_1({
                colno: 0,
                lineno: 0,
                filename: '',
                message: message
            });
        };
        win.addEventListener('unhandledrejection', unhandledRejectionHandler, true);
    }
}
