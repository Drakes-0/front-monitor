export function errorInfo(e: string): void {
    console.error(`[Front-Monitor Error]: ${e}`)
}

export function isObject(o: any): boolean {
    return typeof o === 'object' && o !== null
}

export function isString(o: any): boolean {
    return typeof o === 'string'
}

// export function isArray(o: any): boolean {
//     return Array.isArray(o)
// }

function isAll(o: any): boolean {
    return /^all$/i.test(o)
}

export function isSameErrorEvent(prev: ErrorEventObject, next: ErrorEventObject): boolean {
    return prev.type === next.type && prev.colno === next.colno && prev.lineno === next.lineno && prev.filename === next.filename && prev.message === next.message
}

export const isSameOrigin: ((string) => boolean) = (function () {
    const origin = `${window.location.protocol}//${document.domain}${window.location.port ? ':' + window.location.port : ''}`

    return (fileUrl: string) => {
        return fileUrl.indexOf(origin) === 0
    }
})()

export const genErrorInfoFunc = (fields: string[]): Function => (errorInfo: object): object => {
    const reportInfo = Object.create(null)

    fields.forEach(f => {
        reportInfo[f] = (errorInfo[f] === void 0 ? 'undefined' : errorInfo[f])
    })

    reportInfo.timestamp = Date.now()
    reportInfo.type = (errorInfo as any).custom_type

    return reportInfo as ErrorEventObject
}

export const isXHRErrorFunc = (flag: string | RegExp): Function => (status: number | string): boolean => {
    status += ''
    if (isString(flag)) {
        if (isAll(flag)) {
            return flag !== '200'
        }
        return (flag as string).split('/').indexOf(status as string) > -1
    } else if (flag instanceof RegExp) {
        return flag.test(status as string)
    }
    return false
}