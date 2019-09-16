export default class Reporter implements ReporterInterface {

    private readonly appId: string

    private readonly url: string

    constructor(appId: string, url: string) {
        this.appId = appId
        this.url = url
    }

    report(records: ErrorEventObject[]) {
        const queryString = `?appId=${encodeURIComponent(this.appId)}&ua=${encodeURIComponent(navigator.userAgent)}&records=${encodeURIComponent(JSON.stringify(records))}`
        let img = new Image()
        img.onload = () => {
            img = null
        }
        img.src = `${this.url}${queryString}`
    }
}