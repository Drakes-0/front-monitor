export function isObject(o: any): boolean {
  return typeof o === 'object' && o !== null
}

export function isString(s: any): boolean {
  return typeof s === 'string'
}

export function isFunction(f: any): boolean {
  return typeof f === 'function'
}

export function isRegExp(r: any): boolean {
  return r instanceof RegExp
}

export function polyfillListener() {
  if (typeof window.addEventListener === 'function') {
    return
  }
  window.addEventListener = function (type: string, listener) {
    let wrapper = function (e: any) {
      e.target = e.srcElement
      e.currentTarget = window
      listener.call(window, e)
    }
    window.attachEvent('on' + type, wrapper)
  }
}

export function safeParse(json: any, defaultValue: any = null): any {
  if (!isString(json) || !json.length) {
    return defaultValue
  }

  try {
    return JSON.parse(json)
  } catch (e) {
    console.error(e, json)
    return defaultValue
  }
}
