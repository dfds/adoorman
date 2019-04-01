const { timeProvider } = require("./system-time");

exports.getAccessToken = function (req) {
    const accessTokenPropertyName = "x-amzn-oidc-accesstoken";
    const request = req || {};
    return request[accessTokenPropertyName];
}

exports.getCookieExpirationTime = function (req) {

}