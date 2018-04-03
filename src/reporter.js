class Reporter {
    constructor(reportUrl) {
        this.reportUrl = reportUrl
    }

    report(errors) {
        errors.forEach(console.log)
    }
}

export default (reportUrl) => new Reporter(reportUrl)