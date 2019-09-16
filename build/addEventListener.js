import { ERROR_TYPE } from './defaultConfig';
import { isObject, isSameOrigin } from './util';
export default function (win, catchErrorByCustomType, sameOrigin, catchUnhandledRejection) {
    const catchRuntimeError = catchErrorByCustomType(ERROR_TYPE.RUNTIME);
    const catchResourceError = catchErrorByCustomType(ERROR_TYPE.RESOURCE);
    const handler = (ee) => {
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
                message: `load ${ee.target.tagName} resource failed`
            });
        }
    };
    win.addEventListener('error', handler, true);
    if (catchUnhandledRejection) {
        const catchUnhandledRejectionError = catchErrorByCustomType(ERROR_TYPE.UNHANDLEDREJECTION);
        const unhandledRejectionHandler = (ee) => {
            const message = isObject(ee.reason) ? ee.reason.stack : ee.reason;
            catchUnhandledRejectionError({
                colno: 0,
                lineno: 0,
                filename: '',
                message
            });
        };
        win.addEventListener('unhandledrejection', unhandledRejectionHandler, true);
    }
}
