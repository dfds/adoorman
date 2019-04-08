const headers = {
    identity: "x-amzn-oidc-identity",
    accessToken: "x-amzn-oidc-identity",
    jwt: "x-amzn-oidc-data"
};

export { headers as headerNames };

export default class RequestUtils {
    constructor(options) {
        this.jwtUtils = options.jwtUtils;

        this.getHeaderValue = this.getHeaderValue.bind(this);
        this.getIdentityFrom = this.getIdentityFrom.bind(this);
        this.getAccessTokenFrom = this.getAccessTokenFrom.bind(this);
        this.extractExpirationDateFrom = this.extractExpirationDateFrom.bind(this);
    }

    getHeaderValue(req, name) {
        const headers = req.headers || {};
        return headers[name] || null;
    }

    getIdentityFrom(req) {
        return this.getHeaderValue(req, headers.identity);
    }

    getAccessTokenFrom(req) {
        return this.getHeaderValue(req, headers.accessToken);
    }

    extractExpirationDateFrom(req) {
        const headerValue = this.getHeaderValue(req, headers.jwt);

        if (!headerValue) {
            return null;
        }
        
        const jwt = this.jwtUtils.deserialize(headerValue);
        return new Date(jwt.exp*1000);
    }
}