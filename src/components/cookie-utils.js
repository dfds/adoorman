import Cookies from "cookies";

export default class CookieUtils {

    constructor(options) {
        this.requestUtils = options.requestUtils;
        this.hashUtils = options.hashUtils;

        this.hasValidAuthorizationCookie = this.hasValidAuthorizationCookie.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.attachCookie = this.attachCookie.bind(this);
        this.removeCookie = this.removeCookie.bind(this);
        this.composeCookieNameFrom = this.composeCookieNameFrom.bind(this);
        this.composeCookieValueFrom = this.composeCookieValueFrom.bind(this);
        this.extractExpirationDateFrom = this.extractExpirationDateFrom.bind(this);
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

    composeCookieValueFrom(req) {
        const accessToken = this.requestUtils.getAccessTokenFrom(req);
        return this.hashUtils.getHashOf(accessToken);
    }

    extractExpirationDateFrom(req) {
        return this.requestUtils.extractExpirationDateFrom(req);
    }

    hasValidAuthorizationCookie(req) {
        const cookieName = this.composeCookieNameFrom(req);
        const cookie = this.getCookie(req, cookieName);

        return cookie != null;
    }

    attachCookie(req, res) {
        const cookieName = this.composeCookieNameFrom(req);
        const value = this.composeCookieValueFrom(req);
        const expiration = this.extractExpirationDateFrom(req);

        const cookieJar = new Cookies(req, res, { secure: true });
        cookieJar.set(cookieName, value, { expires: expiration });
    }

    removeCookie(req, res) {
        const cookieName = this.composeCookieNameFrom(req);
        const value = null;
        const expiration = new Date(0);

        const cookieJar = new Cookies(req, res, { 
            secure: true,
        });

        cookieJar.set(cookieName, value, {
            expires: expiration,
            overwrite: true
        });
    }    
}