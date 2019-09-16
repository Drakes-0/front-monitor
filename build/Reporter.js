var Reporter = /** @class */ (function () {
    function Reporter(appId, url) {
        this.appId = appId;
        this.url = url;
    }
    Reporter.prototype.report = function (records) {
        var queryString = "?appId=" + encodeURIComponent(this.appId) + "&ua=" + encodeURIComponent(navigator.userAgent) + "&records=" + encodeURIComponent(JSON.stringify(records));
        var img = new Image();
        img.onload = function () {
            img = null;
        };
        img.src = "" + this.url + queryString;
    };
    return Reporter;
}());
export default Reporter;
