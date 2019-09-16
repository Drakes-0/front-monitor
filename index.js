(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.FrontMonitor = factory());
}(this, (function () { 'use strict';

    var config = {
        appId: 'fm-unnamed',
        reportFields: ['colno', 'lineno', 'filename', 'message'],
        sameOrigin: true,
        distinct: true,
        cacheKey: 'FrontMonitorCache',
        cacheLimit: 50,
        bufferTime: 5000,
        bufferSize: 10,
        xhrErrorLevel: 'ALL',
        xhrErrorMessage: 'message',
        catchUnhandledRejection: true
    };
    var ERROR_TYPE;
    (function (ERROR_TYPE) {
        ERROR_TYPE["RUNTIME"] = "RUNTIME";
        ERROR_TYPE["RESOURCE"] = "RESOURCE";
        ERROR_TYPE["UNHANDLEDREJECTION"] = "UNHANDLEDREJECTION";
        ERROR_TYPE["XMLHTTPREQUEST"] = "XMLHTTPREQUEST";
    })(ERROR_TYPE || (ERROR_TYPE = {}));

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };

    var classCallCheck = function (instance, Constructor) {
      if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
      }
    };

    var createClass = function () {
      function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
      };
    }();

    function errorInfo(e) {
        console.error('[Front-Monitor Error]: ' + e);
    }
    function isObject(o) {
        return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o !== null;
    }
    function isString(o) {
        return typeof o === 'string';
    }
    // export function isArray(o: any): boolean {
    //     return Array.isArray(o)
    // }
    function isAll(o) {
        return (/^all$/i.test(o)
        );
    }
    function isSameErrorEvent(prev, next) {
        return prev.type === next.type && prev.colno === next.colno && prev.lineno === next.lineno && prev.filename === next.filename && prev.message === next.message;
    }
    var isSameOrigin = function () {
        var origin = window.location.protocol + '//' + document.domain + (window.location.port ? ':' + window.location.port : '');
        return function (fileUrl) {
            return fileUrl.indexOf(origin) === 0;
        };
    }();
    var genErrorInfoFunc = function genErrorInfoFunc(fields) {
        return function (errorInfo) {
            var reportInfo = Object.create(null);
            fields.forEach(function (f) {
                reportInfo[f] = errorInfo[f] || '';
            });
            reportInfo.timestamp = Date.now();
            reportInfo.type = errorInfo.custom_type;
            return reportInfo;
        };
    };
    var isXHRErrorFunc = function isXHRErrorFunc(flag) {
        return function (status) {
            status += '';
            if (isString(flag)) {
                if (isAll(flag)) {
                    return flag !== '200';
                }
                return flag.split('/').indexOf(status) > -1;
            } else if (flag instanceof RegExp) {
                return flag.test(status);
            }
            return false;
        };
    };

    var Reporter = function () {
        function Reporter(appId, url) {
            classCallCheck(this, Reporter);

            this.appId = appId;
            this.url = url;
        }

        createClass(Reporter, [{
            key: "report",
            value: function report(records) {
                var queryString = "?appId=" + encodeURIComponent(this.appId) + "&ua=" + encodeURIComponent(navigator.userAgent) + "&records=" + encodeURIComponent(JSON.stringify(records));
                var img = new Image();
                img.onload = function () {
                    img = null;
                };
                img.src = "" + this.url + queryString;
            }
        }]);
        return Reporter;
    }();

    var ErrorStack = function () {
        function ErrorStack(reporter, distinct, cacheKey, cacheLimit, bufferTime, bufferSize) {
            classCallCheck(this, ErrorStack);

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
                } catch (e) {
                    errorInfo('load cached error records failed');
                    this.queue = [];
                }
                window.localStorage.removeItem(this.cacheKey);
            } else {
                this.queue = [];
            }
        }

        createClass(ErrorStack, [{
            key: 'startTimer',
            value: function startTimer() {
                !this.timer && (this.timer = setTimeout(this.flush.bind(this), this.bufferTime));
            }
        }, {
            key: 'cacheRecords',
            value: function cacheRecords() {
                window.localStorage.setItem(this.cacheKey, JSON.stringify(this.queue));
            }
        }, {
            key: 'push',
            value: function push(record) {
                if (this.queue.length >= this.cacheLimit) {
                    return;
                }
                if (this.distinct && this.queue.some(function (e) {
                    return isSameErrorEvent(e, record);
                })) {
                    return;
                }
                this.queue.push(record);
                this.cacheRecords();
                this.startTimer();
            }
        }, {
            key: 'flush',
            value: function flush() {
                var splice = this.queue.splice(0, this.bufferSize);
                if (splice.length) {
                    this.reporter.report(splice);
                    this.cacheRecords();
                }
                this.queue.length && this.startTimer();
            }
        }]);
        return ErrorStack;
    }();

    function addEventListener (win, catchErrorByCustomType, sameOrigin, catchUnhandledRejection) {
        var catchRuntimeError = catchErrorByCustomType(ERROR_TYPE.RUNTIME);
        var catchResourceError = catchErrorByCustomType(ERROR_TYPE.RESOURCE);
        var handler = function handler(ee) {
            if (ee.target === win) {
                if (!sameOrigin || isSameOrigin(ee.filename)) {
                    catchRuntimeError(ee);
                }
            } else if (ee.target instanceof HTMLElement) {
                catchResourceError({
                    colno: 0,
                    lineno: 0,
                    filename: ee.target.src || ee.target.href,
                    message: 'load ' + ee.target.tagName + ' resource failed'
                });
            }
        };
        win.addEventListener('error', handler, true);
        if (catchUnhandledRejection) {
            var catchUnhandledRejectionError = catchErrorByCustomType(ERROR_TYPE.UNHANDLEDREJECTION);
            var unhandledRejectionHandler = function unhandledRejectionHandler(ee) {
                var message = isObject(ee.reason) ? ee.reason.stack : ee.reason;
                catchUnhandledRejectionError({
                    colno: 0,
                    lineno: 0,
                    filename: '',
                    message: message
                });
            };
            win.addEventListener('unhandledrejection', unhandledRejectionHandler, true);
        }
    }

    function hookXHR(isXHRError, catchErrorByCustomType) {
        var catchXHRError = catchErrorByCustomType(ERROR_TYPE.XMLHTTPREQUEST);
        var originalOpenFunc = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function open() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            var method = args[0],
                url = args[1],
                async = args[2];

            this.addEventListener && this.addEventListener('loadend', function hookLoadend() {
                isXHRError(this.status) && catchXHRError({
                    colno: 0,
                    lineno: 0,
                    filename: url,
                    message: method.toUpperCase() + '(' + (async ? 'asynchronous' : 'synchronous') + ') the service resource failed with status:' + this.status
                });
            });
            return originalOpenFunc.apply(this, args);
        };
    }

    var FrontMonitor = function (win) {
        if (typeof win === 'undefined') {
            return errorInfo('monitor need browser-like environment'), function () {};
        }
        return function FrontMonitor(config$$1) {
            if (isString(config$$1)) {
                config$$1 = {
                    reportUrl: config$$1
                };
            }
            if (!isObject(config$$1) || !isString(config$$1.reportUrl) || !config$$1.reportUrl.length) {
                return errorInfo('invalid report url');
            }
            var conf = Object.assign({}, config, config$$1);
            var genErrorInfo = genErrorInfoFunc(conf.reportFields);
            var isXHRError = isXHRErrorFunc(conf.xhrErrorLevel);
            var reporter = new Reporter(conf.appId, conf.reportUrl);
            var stack = new ErrorStack(reporter, conf.distinct, conf.cacheKey, conf.cacheLimit, conf.bufferTime, conf.bufferSize);
            var catchErrorByCustomType = function catchErrorByCustomType(type) {
                return function (ee) {
                    ee.custom_type = type;
                    stack.push(genErrorInfo(ee));
                };
            };
            addEventListener(win, catchErrorByCustomType, conf.sameOrigin, conf.catchUnhandledRejection);
            hookXHR(isXHRError, catchErrorByCustomType);
        };
    }(window);

    return FrontMonitor;

})));
