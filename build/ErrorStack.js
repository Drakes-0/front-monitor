import { errorInfo, isSameErrorEvent } from './util';
var ErrorStack = /** @class */ (function () {
    function ErrorStack(reporter, distinct, cacheKey, cacheLimit, bufferTime, bufferSize) {
        this.distinct = distinct;
        this.cacheKey = cacheKey;
        this.cacheLimit = cacheLimit;
        this.bufferTime = bufferTime;
        this.bufferSize = bufferSize;
        this.reporter = reporter;
        var cachedQueue = window.localStorage.getItem(this.cacheKey);
        if (cachedQueue) {
            try {
                this.queue = JSON.parse(cachedQueue);
                this.queue.length && this.startTimer();
            }
            catch (e) {
                errorInfo('load cached error records failed');
                this.queue = [];
            }
            window.localStorage.removeItem(this.cacheKey);
        }
        else {
            this.queue = [];
        }
    }
    ErrorStack.prototype.startTimer = function () {
        !this.timer && (this.timer = setTimeout(this.flush.bind(this), this.bufferTime));
    };
    ErrorStack.prototype.cacheRecords = function () {
        window.localStorage.setItem(this.cacheKey, JSON.stringify(this.queue));
    };
    ErrorStack.prototype.push = function (record) {
        if (this.queue.length >= this.cacheLimit) {
            return;
        }
        if (this.distinct && this.queue.some(function (e) { return isSameErrorEvent(e, record); })) {
            return;
        }
        this.queue.push(record);
        this.cacheRecords();
        this.startTimer();
    };
    ErrorStack.prototype.flush = function () {
        var splice = this.queue.splice(0, this.bufferSize);
        if (splice.length) {
            this.reporter.report(splice);
            this.cacheRecords();
        }
        this.queue.length && this.startTimer();
    };
    return ErrorStack;
}());
export default ErrorStack;
