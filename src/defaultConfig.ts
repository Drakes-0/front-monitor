const config: MonitorConfig = {
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
}

enum ERROR_TYPE {
    RUNTIME = 'RUNTIME',
    RESOURCE = 'RESOURCE',
    UNHANDLEDREJECTION = 'UNHANDLEDREJECTION',
    XMLHTTPREQUEST = 'XMLHTTPREQUEST'
}

export {
    config as default,
    ERROR_TYPE
}