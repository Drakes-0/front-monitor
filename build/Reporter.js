import { ReportConfig } from './defaultConfig';
class FEEReporter {
    constructor(handler) {
        this.interval = ReportConfig.interval;
        this.retry = ReportConfig.retry;
        this.timer = null;
        this.queue = [];
        this.handler = handler;
        this.retries = 0;
    }
    push(error) {
        if (this.retries >= this.retry) {
            return;
        }
        this.queue.push(error);
        if (this.timer === null) {
            this.timer = setTimeout(() => {
                this.flush();
            }, this.interval);
        }
    }
    flush() {
        const queue = this.queue.slice();
        this.queue = [];
        this.timer = null;
        queue.forEach((e) => {
            try {
                this.handler(e);
            }
            catch (err) {
                console.error(err, e);
                this.retries++;
            }
        });
    }
}
export default FEEReporter;
