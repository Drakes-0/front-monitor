import { ERROR_TYPE_ENUM_AJAX } from './defaultConfig'

export default (isXHRError, catchXHRError) => {

    let originalOpen = XMLHttpRequest.prototype.open

    XMLHttpRequest.prototype.open = function () {
        let method = typeof arguments[0] === 'string'
            ? arguments[0].toUpperCase()
            : 'Request'
        this.addEventListener('load', function () {
            let status = this.status + ''
            isXHRError(status) &&
                catchXHRError(`${method} ${this.responseURL} failed`, ERROR_TYPE_ENUM_AJAX)
        })
        return originalOpen.apply(this, arguments)
    }
}