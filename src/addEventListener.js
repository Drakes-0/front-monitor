import { isObject } from './util'
import {
    ERROR_TYPE_ENUM_RUNTIME,
    ERROR_TYPE_ENUM_RESOURCE,
    ERROR_TYPE_ENUM_UNHANDLEDREJECTION
} from './defaultConfig'

export default (win, silent, catchUnhandledrejection, catchError) => {

    let catchErrorCallback = ({ message, filename, lineno, colno, target }) => {
        isObject(target) && (target === win
            ? catchError(message,
                ERROR_TYPE_ENUM_RUNTIME,
                filename,
                lineno,
                colno,
                navigator.userAgent)
            : catchError('Loading resource failed',
                ERROR_TYPE_ENUM_RESOURCE,
                target.src || target.href))
        return !!silent
    }

    win.addEventListener('error', catchErrorCallback, true)

    if (!catchUnhandledrejection)
        return

    let catchUnhandledrejectionCallback = promiseRejectionEvent => {
        catchError(`Uncaught in promise : ${promiseRejectionEvent.reason}`,
            ERROR_TYPE_ENUM_UNHANDLEDREJECTION)
        return !!silent
    }

    win.addEventListener('unhandledrejection', catchUnhandledrejectionCallback, true)

}