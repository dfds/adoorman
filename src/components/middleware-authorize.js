const defaultOptions = {
    isPassthrough: true,
};

export default class AuthorizeMiddleware {
    constructor(options) {
        options = {...defaultOptions, ...options};
        
        this.isPassthrough = options.isPassthrough;
        this.authorizationService = options.authorizationService;
        this.cookieUtils = options.cookieUtils;

        this.handle = this.handle.bind(this);

        this.hasValidAuthorizationCookie = this.hasValidAuthorizationCookie.bind(this);
        this.isAuthorized = this.isAuthorized.bind(this);
        this.attachCookie = this.attachCookie.bind(this);
        this.sendRejectResponse = this.sendRejectResponse.bind(this);
    }

    hasValidAuthorizationCookie(req) {
        return this.cookieUtils.hasValidAuthorizationCookie(req);
    }

    attachCookie(req, res) {
        this.cookieUtils.attachCookie(req, res);
    }
    
    sendRejectResponse(res) {
        res.writeHead(403, "Forbidden");
        res.write("You are not authorized to view this resource.");
        res.end();
    }

    isAuthorized(req) {
        return this.authorizationService.isAuthorized(req);
    }

    handle(req, res, next) {
        if (this.isPassthrough) {
            next();
        } else if (this.hasValidAuthorizationCookie(req) || this.isAuthorized(req)) {
            next();
            this.attachCookie(req, res);
        } else {
            this.sendRejectResponse(res);
        }
    }
}

export function createHandler(options) {
    const middleware = new AuthorizeMiddleware(options);
    return middleware.handle;
};