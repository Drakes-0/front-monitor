export default class Reporter implements ReporterInterface {

    private readonly appId: string

    private readonly version: string

    private readonly url: string

    constructor(appId: string, version: string = 'unsinged', url: string) {
        this.appId = appId
        this.version = version
        this.url = url
    }

    report(records: ErrorEventObject[]) {
        const queryString = `?appId=${encodeURIComponent(this.appId)}&version=${encodeURIComponent(this.version)}&ua=${encodeURIComponent(navigator.userAgent)}&records=${encodeURIComponent(JSON.stringify(records))}`
        let img = new Image()
        img.onload = () => {
            img = null
        }
        img.src = `${this.url}${queryString}`
    }
}