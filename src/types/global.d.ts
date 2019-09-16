interface MonitorConfig {
    appId: string,
    reportUrl?: string,
    reportFields: Array<string>,
    sameOrigin: boolean,
    distinct: boolean,
    cacheKey: string,
    cacheLimit: number,
    bufferTime: number,
    bufferSize: number,
    xhrErrorLevel: string | RegExp,
    xhrErrorMessage: string,
    catchUnhandledRejection: boolean
}

interface ErrorEventObject {
    type: string,
    colno: number,
    lineno: number,
    filename: string,
    message: string,
    timestamp: number
}

interface ReporterInterface {
    report(records: Array<ErrorEventObject>): void;
}

interface ErrorStackInterface {
    push(record: ErrorEventObject): void;
    flush(): void;
}