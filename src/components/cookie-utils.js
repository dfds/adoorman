import Cookies from "cookies";

export default class CookieUtils {

    constructor(options) {
        this.requestUtils = options.requestUtils;
        this.hashUtils = options.hashUtils;

        this.hasValidAuthorizationCookie = this.hasValidAuthorizationCookie.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.attachCookie = this.attachCookie.bind(this);
        this.composeCookieNameFrom = this.composeCookieNameFrom.bind(this);
    }

    getCookie(request, cookieName) {
        if (!request.headers) {
            return null;
        }

        const cookieJar = new Cookies(request);
        return cookieJar.get(cookieName);
    }

    composeCookieNameFrom(req) {
        const identity = this.requestUtils.getIdentityFrom(req);
        return this.hashUtils.getHashOf(identity);
    }

    hasValidAuthorizationCookie(req) {
        const cookieName = this.composeCookieNameFrom(req);
        const cookie = this.getCookie(req, cookieName);

        return cookie != null;
    }

    attachCookie(req, res) {
        const cookieName = this.composeCookieNameFrom(req);
        const value = "";
        const expiration = "";

        const cookieJar = new Cookies(req, res, { secure: true });
        cookieJar.set(cookieName, value, { expires: expiration });
    }

        // const identity = this.requestUtils.getIdentityFrom(req);
        // const accessToken = this.requestUtils.getAccessTokenFrom(req);

        // const now = this.timeProvider.now();

        // const cookies = new Cookies(req, res, { secure: true });
        // cookies.set(identity, accessToken, {
        //     expires: this.timeProvider.addMinutes(now, 10)
        // });

        // this.cookieUtils.attachCookie(req, res);
    
}