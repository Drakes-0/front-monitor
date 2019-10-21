export default class Reporter {
    constructor(appId, version = 'Default', url) {
        this.appId = appId;
        this.version = version;
        this.url = url;
    }
    report(records) {
        const queryString = `?appId=${encodeURIComponent(this.appId)}&version=${encodeURIComponent(this.version)}&records=${encodeURIComponent(JSON.stringify(records))}`;
        let img = new Image();
        img.onload = () => {
            img = null;
        };
        img.src = `${this.url}${queryString}`;
    }
}
