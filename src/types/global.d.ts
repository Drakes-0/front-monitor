interface Window {
  [property: string]: any
}

declare enum FEErrorTypeEnum {
  RESOURCE = 'resource',
  RUNTIME = 'runtime',
  XHR = 'xhr',
  UNHANDLED = 'unhandled'
}

interface FEErrorInfoInterface {
  colno?: number
  lineno?: number
  filename?: string
  data?: any
}

interface FEErrorInterface {
  referrer: string
  type: FEErrorTypeEnum
  time: number
  message: string
  info?: FEErrorInfoInterface
}

interface FEEMConfigInterface {
  handler(e: FEErrorInterface): void
  catchUnhandledRejection?: boolean
  xhrRule?: RegExp | Function
}

declare abstract class FEEMonitorInterface {
  config: FEEMConfigInterface
  reporter: FEEReporterInterface
  constructor(config: FEEMConfigInterface)

  catchResourceAndRuntimeError(): void
  catchXHRError(rule: RegExp | Function): void
  catchUnhandledRejection(): void
  throwError(
    type: FEErrorTypeEnum,
    message: string,
    info?: FEErrorInfoInterface
  ): void
}

declare abstract class FEEReporterInterface {
  queue: FEErrorInterface[]
  interval: number
  retry: number
  timer: any
  handler: (e: FEErrorInterface) => void

  constructor(handler: (e: FEErrorInterface) => void)

  push(error: FEErrorInterface): void
  flush(): void
}
