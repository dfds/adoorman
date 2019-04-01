const httpProxy = require("http-proxy");

module.exports = function (options) {
    const proxy = httpProxy.createProxyServer({ target: options.target });
    const middleware = (req, res, next) => proxy.web(req, res);

    return middleware;
};