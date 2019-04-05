import assert from "assert";
import CookieUtils from "./../components/cookie-utils";

const reqBuilder = (options) => {
    return {

    };
};

const resBuilder = (options) => {
    const defaults = {
        getHeader: () => null,
        setHeader: () => { }
    };

    return {...defaults, ...options};
};

const buildSut = (options) => {

    const defaults = {
        requestUtils: { getIdentityFrom: () => null },
        hashUtils: { getHashOf: () => null },
    };

    options = {...defaults, ...options};

    return new CookieUtils(options);
};

describe("CookieUtils", () => {

    describe("getCookie", () => {
        it("returns expected when no cookie is available in the request", () => {
            const reqStub = { headers: {} };
            const sut = buildSut();
            
            const result = sut.getCookie(reqStub);

            assert.equal(result, null, "Did not expect request to have cookie");
        });
        it("returns expected when no headers is available in the request", () => {
            const reqStub = { };
            const sut = buildSut();
            
            const result = sut.getCookie(reqStub);

            assert.equal(result, null, "Did not expect request to have cookie");
        });
        it("returns expected when cookie is available in the request", () => {
            const cookieNameStub = "foo";
            const expectedCookieValue = "bar";
            const reqStub = { 
                headers: {
                    cookie: `${cookieNameStub}=${expectedCookieValue}`
                }
            };

            const sut = buildSut();
            
            const result = sut.getCookie(reqStub, cookieNameStub);

            assert.equal(result, expectedCookieValue, `Expected request to have a "${expectedCookieValue}" cookie`);
        });
    });

    describe("hasValidAuthorizationCookie", () => {
        it("returns expected when no cookie is available in the request", () => {
            const reqStub = { headers: {} };
            const sut = buildSut();
            
            const result = sut.hasValidAuthorizationCookie(reqStub);

            assert.equal(result, false, "Did not expect request to have a valid cookie");
        });
        it("returns expected when no headers is available in the request", () => {
            const reqStub = { };
            const sut = buildSut();
            
            const result = sut.hasValidAuthorizationCookie(reqStub);

            assert.equal(result, false, "Did not expect request to have a valid cookie");
        });
        it("returns expected when cookie is available in the request", () => {
            const cookieNameStub = "foo";
            const reqStub = { 
                headers: {
                    cookie: `${cookieNameStub}=bar`
                }
            };

            const sut = buildSut({
                hashUtils: { getHashOf: () => cookieNameStub }
            });
          
            const result = sut.hasValidAuthorizationCookie(reqStub);

            assert.equal(result, true, `Expected request to have a valid cookie`);
        });
    });

    describe("attachCookie", () => {
        it("attaches cookie with expected name", () => {

            const expectedCookieName = "foo";

            const sut = buildSut({
                hashUtils: { getHashOf: () => expectedCookieName }
            });

            const cookies = [];

            const req = reqBuilder({});
            const resSpy = resBuilder({
                setHeader: (key, value) => {
                    if (key != "Set-Cookie") {
                        return
                    }

                    // const elements = value[0].split(";");
                    // const result = {};
                    // elements.forEach(x => {
                    //     const pair = x.trim().split("=");
                    //     const key = pair[0];
                    //     const value = pair.length == 2 ? pair[1] : true;
                    //     result[key] = value;
                    // });
                    // cookies.push(result);

                    cookies.push("something lalala " + value[0]);
                }
            });

            sut.attachCookie(req, resSpy);

            const temp = cookies[0];
            const result = temp.match(`^.*? path=.*?;.*?$`);
            console.log(result);
        });

    // it("attaches expected cookie to response when authorized", () => {
    //     const stubIdentity = "foo-identity";
    //     const stubAccessToken = "foo-access-token";

    //     const expectedExpirationDelayInMinutes = 10;
    //     const expectedExpiration = new Date();
    //     const expectedCookieElements = [
    //         `${stubIdentity}=${stubAccessToken}`,
    //         "path=/",
    //         `expires=${expectedExpiration.toUTCString()}`,
    //         "secure",
    //         "httponly"
    //     ];

    //     const actualResponseHeaders = [];
    //     const resSpy = responseBuilder({
    //         setHeader: (name, value) => {
    //             const result = {};
    //             result[name] = value;
    //             actualResponseHeaders.push(result);
    //         },
    //     });

    //     const sut = sutBuilder({ 
    //         isPassthrough: false,
    //         authorizationService: { isAuthorized: () => true },
    //         requestUtils: { 
    //             getIdentityFrom: () => stubIdentity,
    //             getAccessTokenFrom: () => stubAccessToken
    //         },
    //         timeProvider: { 
    //             now: () => expectedExpiration.subtractMinutes(expectedExpirationDelayInMinutes),
    //             addMinutes: () => expectedExpiration
    //         }
    //     });
        
    //     const reqDummy = requestBuilder();
    //     const nextDummy = () => {};

    //     sut.handle(reqDummy, resSpy, nextDummy);

    //     const expectedCookieHeader = [
    //         { "Set-Cookie": [ expectedCookieElements.join("; ")]},
    //     ];

    //     assert.deepEqual(actualResponseHeaders, expectedCookieHeader, `Expected ${JSON.stringify(expectedCookieHeader)} but got ${JSON.stringify(actualResponseHeaders)}`);
    // });
    });
});