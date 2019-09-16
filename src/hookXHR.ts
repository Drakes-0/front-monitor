import { ERROR_TYPE } from './defaultConfig'

export default function hookXHR(isXHRError: Function, catchErrorByCustomType: Function) {
    const catchXHRError = catchErrorByCustomType(ERROR_TYPE.XMLHTTPREQUEST)

    const originalOpenFunc = XMLHttpRequest.prototype.open

    XMLHttpRequest.prototype.open = function open(...args) {
        const [method, url, async] = args

        this.addEventListener && this.addEventListener('loadend', function hookLoadend() {
            isXHRError(this.status) && catchXHRError({
                colno: 0,
                lineno: 0,
                filename: url,
                message: `${(method as string).toUpperCase()}(${async ? 'asynchronous' : 'synchronous'}) the service resource failed with status:${this.status}`
            })
        })

        return originalOpenFunc.apply(this, args)
    }
}