import Cookies from "cookies";

const defaultOptions = {
    isPassthrough: true,
};

export default class AuthorizeMiddleware {
    constructor(options) {
        const cfg = {...defaultOptions, ...options};
        
        this.isPassthrough = cfg.isPassthrough;
        this.authorizationService = cfg.authorizationService;

        this.handle = this.handle.bind(this);

        this.hasAuthorizationCookie = this.hasAuthorizationCookie.bind(this);
        this.attachCookie = this.attachCookie.bind(this);
        this.sendRejectResponse = this.sendRejectResponse.bind(this);
    }

    hasAuthorizationCookie(req) {
        return false;
    }

    attachCookie(req, res) {
        const cookies = new Cookies(req, res, { secure: true });
        cookies.set("foo", "bar");
        cookies.set("baz", "qux");
    }
    
    sendRejectResponse(res) {
        res.writeHead(403, "Forbidden");
        res.write("You are not authorized to view this resource.");
        res.end();
    }

    handle(req, res, next) {

        if (this.isPassthrough) {
            next();
            return;
        }

        if (this.authorizationService.isAuthorized()) {
            next();
            this.attachCookie(req, res);
            return;
        }

        this.sendRejectResponse(res);

        // if (this.isPassthrough || this.hasAuthorizationCookie(req) || this.isMemberOfGroups()) {
        //     next();
        //     this.attachCookie(res);
        // } else {
        //     this.sendRejectResponse(res);
        // }
    }
}

export function createHandler(options) {
    const middleware = new AuthorizeMiddleware(options);
    return middleware.handle;
};