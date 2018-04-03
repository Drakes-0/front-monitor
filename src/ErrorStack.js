import { diffError } from './util'

/**
 * Subclass Array might not work
 * first point : reference http://2ality.com/2013/03/subclassing-builtins-es6.html
 * not serializable
 */
export default class ErrorStack {
    constructor(reporter, cacheKey, distinct, bufferTime, bufferSize) {
        this.reporter = reporter
        this.cacheKey = cacheKey
        this.distinct = distinct
        this.bufferTime = Math.min(bufferTime, 10000)
        this.bufferSize = Math.min(bufferSize, 100)
        this.timer = void 0
        this.queue = []
    }

    push(err) {
        if (this.distinct && this.queue.some(e => diffError(e, err)))
            return

        this.queue.push(err)
        this.timer && clearTimeout(this.timer)
        this.length >= this.bufferSize
            ? this.flush()
            : (this.timer = setTimeout(() => void this.flush.call(this), this.bufferTime))
    }

    flush() {
        let errors = this.queue.slice(0)
        this.queue.length = 0
        this.reporter.report(errors)
    }
}
