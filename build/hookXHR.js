import { ERROR_TYPE } from './defaultConfig';
export default function hookXHR(isXHRError, catchErrorByCustomType) {
    var catchXHRError = catchErrorByCustomType(ERROR_TYPE.XMLHTTPREQUEST);
    var originalOpenFunc = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function open() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var method = args[0], url = args[1], async = args[2];
        this.addEventListener && this.addEventListener('loadend', function hookLoadend() {
            isXHRError(this.status) && catchXHRError({
                colno: 0,
                lineno: 0,
                filename: url,
                message: method.toUpperCase() + "(" + (async ? 'asynchronous' : 'synchronous') + ") the service resource failed with status:" + this.status
            });
        });
        return originalOpenFunc.apply(this, args);
    };
}
