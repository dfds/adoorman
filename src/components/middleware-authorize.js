import Cookies from "cookies";

const defaultOptions = {
    isPassthrough: true,
};

export default class AuthorizeMiddleware {
    constructor(options) {
        const cfg = {...defaultOptions, ...options};
        
        this.isPassthrough = cfg.isPassthrough;
        this.authorizationService = cfg.authorizationService;
        this.requestUtils = cfg.requestUtils;

        this.handle = this.handle.bind(this);

        this.hasAuthorizationCookie = this.hasAuthorizationCookie.bind(this);
        this.attachCookie = this.attachCookie.bind(this);
        this.sendRejectResponse = this.sendRejectResponse.bind(this);
        this.isAuthorized = this.isAuthorized.bind(this);
    }

    hasAuthorizationCookie(req) {
        return false;
    }

    attachCookie(req, res) {
        const identity = this.requestUtils.getIdentityFrom(req);
        const accessToken = this.requestUtils.getAccessTokenFrom(req);

        const cookies = new Cookies(req, res, { secure: true });
        cookies.set(identity, accessToken);
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
        } else if (this.isAuthorized(req)) {
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