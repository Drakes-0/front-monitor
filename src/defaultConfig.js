const defaultConfig = {
    distinct: true,
    silent: false,
    bufferTime: 2000,
    bufferSize: 20,
    xhrErrorLevel: '4/5',
    catchUnhandledrejection: false,
    cacheKey: 'MonitorErrorCache',
    reportUrl: 'http://127.0.0.1:8080',
    postFields: ['message', 'type', 'resource', 'line', 'column', 'ua']
}

const ERROR_TYPE_ENUM_RUNTIME = 'RUNTIME'
const ERROR_TYPE_ENUM_RESOURCE = 'RESOURCE'
const ERROR_TYPE_ENUM_UNHANDLEDREJECTION = 'UNHANDLEDREJECTION'
const ERROR_TYPE_ENUM_AJAX = 'AJAX'

export {
    defaultConfig as default,
    ERROR_TYPE_ENUM_RUNTIME,
    ERROR_TYPE_ENUM_RESOURCE,
    ERROR_TYPE_ENUM_UNHANDLEDREJECTION,
    ERROR_TYPE_ENUM_AJAX
}