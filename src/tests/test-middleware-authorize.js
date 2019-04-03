import assert from "assert";
import AuthorizeMiddleware from "./../components/middleware-authorize";

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
    const defaultValues = {
        isPassthrough: false,
        isAuthorized: false,
        identity: "foo-identity",
        accessToken: "foo-access-token"
    };

    options = {...defaultValues, ...options};

    const defaultDependencies = {
        authorizationService: { 
            isAuthorized: () => options.isAuthorized 
        },
        requestUtils: { 
            getIdentityFrom: () => options.identity,
            getAccessTokenFrom: () => options.accessToken
        }        
    };

    options = {...defaultDependencies, ...options};

    return new AuthorizeMiddleware({ 
        isPassthrough: options.isPassthrough,
        authorizationService: options.authorizationService,
        requestUtils: options.requestUtils
    });
};

describe("AuthorizeMiddleware", () => {

    it("invokes next on passthrough", () => {
        let wasNextInvoked = false;

        const sut = new AuthorizeMiddleware({ isPassthrough: true });
        
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

        const sut = new AuthorizeMiddleware({ 
            isPassthrough: false,
            authorizationService: { isAuthorized: () => true },
            requestUtils: { getIdentityFrom: () => "dummy-identity" }
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

        const sut = new AuthorizeMiddleware({ 
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

        const sut = new AuthorizeMiddleware({ 
            isPassthrough: false,
            authorizationService: { isAuthorized: () => false }
        });
        
        sut.handle(reqDummy, resSpy, nextDummy);

        assert.equal(sentStatusCode, expectedStatusCode, `Expected sent status code to be ${expectedStatusCode} but got ${sentStatusCode}`);
    });

    it("attatches a cookie to response when authorized", () => {
        const stubIdentity = "foo-identity";
        const stubAccessToken = "foo-access-token";
        const headers = [];
        const expected = [
            { "Set-Cookie": [`${stubIdentity}=${stubAccessToken}; path=/; secure; httponly`]},
        ];

        const reqDummy = requestBuilder();
        const resSpy = responseBuilder({
            setHeader: (name, value) => {
                const result = {};
                result[name] = value;
                headers.push(result);
            },
        });

        const nextDummy = () => {};

        const sut = new AuthorizeMiddleware({ 
            isPassthrough: false,
            authorizationService: { isAuthorized: () => true },
            requestUtils: { 
                getIdentityFrom: (req) => stubIdentity,
                getAccessTokenFrom: (req) => stubAccessToken
            }
        });
        
        sut.handle(reqDummy, resSpy, nextDummy);

        assert.deepEqual(headers, expected, `Expected ${JSON.stringify(expected, null, 2)} but got ${JSON.stringify(headers, null, 2)}`);
    });
});