import { default as defaultConfig } from './defaultConfig'
import { genErrorInfoFunc, genXHRErrorFunc } from './util'
import ErrorStack from './ErrorStack'
import addEventListener from './addEventListener'
import hookXHR from './hookXHR'
import reporterFactory from './reporter'

export default function (config) {

    if (typeof window === 'undefined')
        return console.error('Monitor need browser environment')

    let win = window,
        conf = Object.assign({},
            defaultConfig,
            config),
        genErrorInfo = genErrorInfoFunc(conf.postFields),
        isXHRError = genXHRErrorFunc(conf.xhrErrorLevel),
        stack = new ErrorStack(reporterFactory(conf.reportUrl),
            conf.cacheKey,
            conf.distinct,
            conf.bufferTime,
            conf.bufferSize),
        catchError = (...args) => void stack.push(genErrorInfo(...args))

    /**
     * Hook the XMLHttpRequest is always effective 
     * (ignore ActiveXObject at present) BUT dangerous
     * remain to be seen , especially working with 
     * some other AJAX library 
     */
    hookXHR(isXHRError, catchError)

    /**
     * In most cases , caught unhandledrejection won't 
     * provide much useful information , make your own 
     * decisions to catch it or not
     */
    addEventListener(win, conf.silent, conf.catchUnhandledrejection, catchError)

}