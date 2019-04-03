import httpProxy from "http-proxy";

const defaultProxyServerFactory = (target) => httpProxy.createProxyServer({ target: target });

export default class ProxyMiddleware {
    constructor(options) {
        const proxyFactory = options.proxyFactory || defaultProxyServerFactory;
        this.proxy = proxyFactory(options.target);
    }

    handle(req, res, next) {
        this.proxy.web(req, res);
    }
}

export function createHandler(options) {
    const middleware  = new ProxyMiddleware(options);
    return middleware.handle;
}