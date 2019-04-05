import assert from "assert";
import moment  from "moment";
import AuthorizeMiddleware from "./../components/middleware-authorize";

Date.prototype.addMinutes = function(minutes) {
    const timestamp = this.getTime();
    const newTimestamp = timestamp+(minutes*60*1000);
    return new Date(newTimestamp);
}

Date.prototype.subtractMinutes = function(minutes) {
    const timestamp = this.getTime();
    const newTimestamp = timestamp-(minutes*60*1000);
    return new Date(newTimestamp);
}

const requestBuilder = (options) => {
    const defaults = {
        connection: {
            encrypted: true
        }
    }

    return {...defaults, ...options};
};

const responseBuilder = (options) => {
    const defaults = {
        getHeader: () => null,
        writeHead: () => {},
        setHeader: () => {},
        write: () => {},
        end: () => {},
    };
    return {...defaults, ...options};
};

const sutBuilder = (options) => {
    const defaults = {
        isPassthrough: false,
        authorizationService: {
            isAuthorized: () => false
        },
        requestUtils: { 
            getIdentityFrom: () => "foo-identity",
            getAccessTokenFrom: () => "foo-access-token"
        },
        timeProvider: {
            now: () => new Date(),
            addMinutes: () => new Date(),
        }
    };

    options = {...defaults, ...options};

    return new AuthorizeMiddleware(options);
};

describe("AuthorizeMiddleware", () => {

    it("invokes next on passthrough", () => {
        let wasNextInvoked = false;

        const sut = sutBuilder({
            isPassthrough: true
        });
        
        const reqDummy = {};
        const resDummy = {};
        const nextSpy = () => wasNextInvoked = true;

        sut.handle(reqDummy, resDummy, nextSpy);

        assert.equal(wasNextInvoked, true, "Expected next callback to be invoked");
    });

    it("invokes authorization service", () => {
        const reqDummy = requestBuilder();
        const resDummy = responseBuilder();
        const nextDummy = () => {};

        const authorizationServiceSpy = {
            _wasInvoked: false,
            isAuthorized: function(req) { 
                this._wasInvoked = true;
            },
        };

        const sut = sutBuilder({
            isPassthrough: false,
            authorizationService: authorizationServiceSpy
        });

        sut.handle(reqDummy, resDummy, nextDummy);

        assert.equal(authorizationServiceSpy._wasInvoked, true, "Expected authorization service to be invoked");
    });

    it("invokes next when authorized", () => {
        let wasNextInvoked = false;
        
        const reqDummy = requestBuilder();
        const resDummy = responseBuilder();
        const nextSpy = () => wasNextInvoked = true;

        const sut = sutBuilder({ 
            isPassthrough: false,
            authorizationService: { isAuthorized: () => true },
            timeProvider: {
                now: () => new Date(),
                addMinutes: () => new Date(),
            }
        });
        
        sut.handle(reqDummy, resDummy, nextSpy);

        assert.equal(wasNextInvoked, true, "Expected next callback to be invoked");
    });

    it("does NOT invoke next when NOT authorized", () => {
        let wasNextInvoked = false;
        
        const reqDummy = {};
        const resDummy = { 
            writeHead: () => {},
            write: () => {},
            end: () => {},
        };
        const nextSpy = () => wasNextInvoked = true;

        const sut = sutBuilder({ 
            isPassthrough: false,
            authorizationService: { isAuthorized: () => false }
        });
        
        sut.handle(reqDummy, resDummy, nextSpy);

        assert.equal(wasNextInvoked, false, "Unexpected invocation of next middleware when NOT authorized");
    });

    it("sends a rejection back when NOT authorized", () => {
        const expectedStatusCode = 403;
        let sentStatusCode = null;

        const reqDummy = {};
        const resSpy = responseBuilder({
            writeHead: (statusCode) => sentStatusCode = statusCode,
        });

        const nextDummy = () => {};

        const sut = sutBuilder({ 
            isPassthrough: false,
            authorizationService: { isAuthorized: () => false }
        });
        
        sut.handle(reqDummy, resSpy, nextDummy);

        assert.equal(sentStatusCode, expectedStatusCode, `Expected sent status code to be ${expectedStatusCode} but got ${sentStatusCode}`);
    });

    it("attaches expected cookie to response when authorized", () => {
        const stubIdentity = "foo-identity";
        const stubAccessToken = "foo-access-token";

        const expectedExpirationDelayInMinutes = 10;
        const expectedExpiration = new Date();
        const expectedCookieElements = [
            `${stubIdentity}=${stubAccessToken}`,
            "path=/",
            `expires=${expectedExpiration.toUTCString()}`,
            "secure",
            "httponly"
        ];

        const actualResponseHeaders = [];
        const resSpy = responseBuilder({
            setHeader: (name, value) => {
                const result = {};
                result[name] = value;
                actualResponseHeaders.push(result);
            },
        });

        const sut = sutBuilder({ 
            isPassthrough: false,
            authorizationService: { isAuthorized: () => true },
            requestUtils: { 
                getIdentityFrom: () => stubIdentity,
                getAccessTokenFrom: () => stubAccessToken
            },
            timeProvider: { 
                now: () => expectedExpiration.subtractMinutes(expectedExpirationDelayInMinutes),
                addMinutes: () => expectedExpiration
            }
        });
        
        const reqDummy = requestBuilder();
        const nextDummy = () => {};

        sut.handle(reqDummy, resSpy, nextDummy);

        const expectedCookieHeader = [
            { "Set-Cookie": [ expectedCookieElements.join("; ")]},
        ];

        assert.deepEqual(actualResponseHeaders, expectedCookieHeader, `Expected ${JSON.stringify(expectedCookieHeader)} but got ${JSON.stringify(actualResponseHeaders)}`);
    });
});