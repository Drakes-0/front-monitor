import DefaultConfig from './defaultConfig'
import {
  isObject,
  isString,
  isFunction,
  isRegExp,
  polyfillListener,
  safeParse
} from './util'
import FEEReporter from './reporter'

class FEEMonitor implements FEEMonitorInterface {
  config: FEEMConfigInterface
  reporter: FEEReporterInterface

  constructor(config: FEEMConfigInterface) {
    this.config = { ...DefaultConfig, ...config }
    this.reporter = new FEEReporter(this.config.handler)
    this.catchResourceAndRuntimeError()
    this.catchXHRError(this.config.xhrRule)
    this.config.catchUnhandledRejection && this.catchUnhandledRejection()
  }

  catchResourceAndRuntimeError() {
    polyfillListener()
    const _this = this
    const handler = function (e: any) {
      if (!e) {
        return
      }
      if (e.target === window) {
        _this.throwError(
          FEErrorTypeEnum.RUNTIME,
          isString(e) ? e : e.message || '',
          {
            colno: e.colno || 0,
            lineno: e.lineno || 0,
            filename: e.filename || ''
          }
        )
      } else if (e.target instanceof HTMLElement) {
        _this.throwError(
          FEErrorTypeEnum.RESOURCE,
          `load ${e.target.tagName} resource:${
            e.target.src || e.target.href
          } failed`
        )
      }
    }
    window.addEventListener('error', handler, true)
  }

  catchUnhandledRejection() {
    const _this = this
    const handler = function (e: any) {
      const message = isObject(e.reason) ? e.reason.stack : e.reason
      _this.throwError(FEErrorTypeEnum.UNHANDLED, message)
    }
    window.addEventListener('unhandledrejection', handler, true)
  }

  catchXHRError(rule: RegExp | Function) {
    const originalOpenFunc = XMLHttpRequest.prototype.open
    const originalSendFunc = XMLHttpRequest.prototype.send
    const _this = this

    XMLHttpRequest.prototype.open = function open(...args) {
      const [method, url] = args

      this._openData = {
        method,
        url
      }

      return originalOpenFunc.apply(this, args)
    }

    XMLHttpRequest.prototype.send = function send(...args) {
      const xhr = this
      const listener = xhr.onreadystatechange

      xhr.onreadystatechange = function onreadystatechange() {
        listener && listener.call(xhr)

        if (xhr.readyState !== 4) {
          return
        }

        if (isFunction(rule)) {
          if ((rule as Function)(xhr.status, safeParse(xhr.responseText, {}))) {
            return
          }
        } else if (isRegExp(rule)) {
          if ((rule as RegExp).test(xhr.status + '')) {
            return
          }
        } else {
          return
        }

        const { method = 'Request', url = 'unknown' } = xhr._openData || {}
        _this.throwError(FEErrorTypeEnum.XHR, `${method} ${url} failed`)
      }

      return originalSendFunc.apply(xhr, args)
    }
  }

  throwError(
    type: FEErrorTypeEnum,
    message: string,
    info?: FEErrorInfoInterface
  ) {
    this.reporter.push({
      referrer: window.location.href,
      type,
      time: Date.now(),
      message,
      info
    })
  }
}

export default FEEMonitor
