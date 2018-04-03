var defaultConfig = {
    distinct: true,
    silent: false,
    bufferTime: 2000,
    bufferSize: 20,
    xhrErrorLevel: '4/5',
    catchUnhandledrejection: false,
    cacheKey: 'MonitorErrorCache',
    postFields: ['message', 'type', 'resource', 'line', 'column', 'ua']
};

var ERROR_TYPE_ENUM_RUNTIME = 'RUNTIME';
var ERROR_TYPE_ENUM_RESOURCE = 'RESOURCE';
var ERROR_TYPE_ENUM_UNHANDLEDREJECTION = 'UNHANDLEDREJECTION';
var ERROR_TYPE_ENUM_AJAX = 'AJAX';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isObject = function isObject(obj) {
    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
};

var genErrorInfoFunc = function genErrorInfoFunc(fieldsConf) {
    return function () {
        for (var _len = arguments.length, fields = Array(_len), _key = 0; _key < _len; _key++) {
            fields[_key] = arguments[_key];
        }

        var errorInfo = Object.create(null);

        fieldsConf.forEach(function (f, i) {
            errorInfo[f] = fields[i] || '';
        });

        return errorInfo;
    };
};

var genXHRErrorFunc = function genXHRErrorFunc(xhrErrorLevel) {
    xhrErrorLevel = xhrErrorLevel.split(/\//);
    return function (xhrStatus) {
        return xhrErrorLevel.some(function (l) {
            return xhrStatus.startsWith(l);
        });
    };
};

var diffError = function diffError(pre, next) {
    var preKeys = Object.keys(pre);

    for (var i = 0; i < preKeys.length; i++) {
        if (pre[preKeys[i]] !== next[preKeys[i]]) return false;
    }

    return true;
};

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ErrorStack = function (_Array) {
    _inherits(ErrorStack, _Array);

    function ErrorStack(reporter, cacheKey, distinct, bufferTime, bufferSize) {
        _classCallCheck(this, ErrorStack);

        var _this = _possibleConstructorReturn(this, (ErrorStack.__proto__ || Object.getPrototypeOf(ErrorStack)).call(this));

        _this.reporter = reporter;
        _this.cacheKey = cacheKey;
        _this.distinct = distinct;
        _this.bufferTime = Math.min(bufferTime, 10000);
        _this.bufferSize = Math.min(bufferSize, 100);
        _this.timer = void 0;
        return _this;
    }

    _createClass(ErrorStack, [{
        key: 'push',
        value: function push() {
            var _arguments = arguments;

            if (this.distinct && this.some(function (e) {
                return diffError(e, _arguments[0]);
            })) return;

            _get(ErrorStack.prototype.__proto__ || Object.getPrototypeOf(ErrorStack.prototype), 'push', this).apply(this, arguments);

            this.timer && clearTimeout(this.timer);

            if (this.length >= this.bufferSize) this.flush();else this.timer = setTimeout(this.flush, this.bufferTime);
        }
    }, {
        key: 'flush',
        value: function flush() {
            var errors = this.slice(0);
            this.length = 0;
            this.reporter.report(errors);
        }
    }]);

    return ErrorStack;
}(Array);

var addEventListener = (function (win, silent, catchUnhandledrejection, catchError) {

    var catchErrorCallback = function catchErrorCallback(_ref) {
        var message = _ref.message,
            filename = _ref.filename,
            lineno = _ref.lineno,
            colno = _ref.colno,
            target = _ref.target;

        isObject(target) && (target === win ? catchError(message, ERROR_TYPE_ENUM_RUNTIME, filename, lineno, colno, navigator.userAgent) : catchError('Loading resource failed', ERROR_TYPE_ENUM_RESOURCE, target.src || target.href));
        return !!silent;
    };

    win.addEventListener('error', catchErrorCallback, true);

    if (!catchUnhandledrejection) return;

    var catchUnhandledrejectionCallback = function catchUnhandledrejectionCallback(promiseRejectionEvent) {
        catchError('Uncaught in promise : ' + promiseRejectionEvent.reason, ERROR_TYPE_ENUM_UNHANDLEDREJECTION);
        return !!silent;
    };

    win.addEventListener('unhandledrejection', catchUnhandledrejectionCallback, true);
});

var hookXHR = (function (isXHRError, catchXHRError) {

    var originalOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function () {
        var method = typeof arguments[0] === 'string' ? arguments[0].toUpperCase() : 'Request';
        this.addEventListener('load', function () {
            var status = this.status + '';
            isXHRError(status) && catchXHRError(method + ' ' + this.responseURL + ' failed', ERROR_TYPE_ENUM_AJAX);
        });
        return originalOpen.apply(this, arguments);
    };
});

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reporter = function () {
    function Reporter(reportUrl) {
        _classCallCheck$1(this, Reporter);

        this.reportUrl = reportUrl;
    }

    _createClass$1(Reporter, [{
        key: "report",
        value: function report(errors) {
            errors.forEach(console.log);
        }
    }]);

    return Reporter;
}();

var reporterFactory = (function (reportUrl) {
    return new Reporter(reportUrl);
});

function monitor (config) {

    if (typeof window === 'undefined') return console.error('Monitor need browser environment');

    var win = window,
        conf = Object.assign({}, defaultConfig, config),
        genErrorInfo = genErrorInfoFunc(conf.postFields),
        isXHRError = genXHRErrorFunc(conf.xhrErrorLevel),
        stack = new ErrorStack(reporterFactory(conf.reportUrl), conf.cacheKey, conf.distinct, conf.bufferTime, conf.bufferSize),
        catchError = function catchError() {
        return void stack.push(genErrorInfo.apply(undefined, arguments));
    };

    /**
     * Hook the XMLHttpRequest is always effective 
     * (ignore ActiveXObject at present) BUT dangerous
     * remain to be seen , especially working with 
     * some other AJAX library 
     */
    hookXHR(isXHRError, catchError);

    /**
     * In most cases , caught unhandledrejection won't 
     * provide much useful information , make your own 
     * decisions to catch it or not
     */
    addEventListener(win, silent, conf.catchUnhandledrejection, catchError);
}

export default monitor;
