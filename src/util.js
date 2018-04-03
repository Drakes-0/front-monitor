export const isObject = obj => typeof obj === 'object' && obj !== null

export const genErrorInfoFunc = fieldsConf => (...fields) => {
    let errorInfo = Object.create(null)

    fieldsConf.forEach((f, i) => {
        errorInfo[f] = fields[i] || ''
    })

    return errorInfo
}

export const genXHRErrorFunc = xhrErrorLevel => {
    xhrErrorLevel = xhrErrorLevel.split(/\//)
    return xhrStatus => xhrErrorLevel.some(l => xhrStatus.startsWith(l))
}

export const diffError = (pre, next) => {
    let preKeys = Object.keys(pre)

    for (let i = 0; i < preKeys.length; i++) {
        if (pre[preKeys[i]] !== next[preKeys[i]])
            return false
    }

    return true
}
