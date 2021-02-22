const DefaultConfig = {
    handler() { },
    catchUnhandledRejection: true,
    xhrRule(status) {
        return status !== 200 && status !== 304;
    }
};
export const ReportConfig = {
    interval: 5000,
    retry: 3
};
export default DefaultConfig;
