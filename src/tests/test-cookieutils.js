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
        requestUtils: { 
            getIdentityFrom: () => "dummy-identity",
            getAccessTokenFrom: () => "dummy-access-token",
            extractExpirationDateFrom: () => new Date()
        },
        hashUtils: { 
            getHashOf: (input) => input
        },
    };

    options = {...defaults, ...options};

    options.requestUtils = {...defaults.requestUtils, ...options.requestUtils};
    options.hashUtils = {...defaults.hashUtils, ...options.hashUtils};

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
            const expected = "foo";

            const hashUtilsPassthroughFake = {
                getHashOf: (input) => input
            };

            const sut = buildSut({
                hashUtils: hashUtilsPassthroughFake,
                requestUtils: {
                    getIdentityFrom: () => expected,
                }
            });

            const cookies = [];

            const req = reqBuilder({});
            const resSpy = resBuilder({
                setHeader: (key, value) => cookies.push(value[0])
            });

            sut.attachCookie(req, resSpy);

            // guard assert
            assert.equal(cookies.length, 1, "Unexpected amount of cookies attached to response");

            const cookieNameRegEx = new RegExp(/\s*(\w+)=.*/);
            const result = cookieNameRegEx.exec(cookies[0]);

            assert.equal(result[1], expected, "Unexpected name/format of cookie");
        });
        it("attaches cookie with expected value", () => {
            const expected = "foo";

            const hashUtilsPassthroughFake = {
                getHashOf: (input) => input
            };

            const sut = buildSut({
                hashUtils: hashUtilsPassthroughFake,
                requestUtils: {
                    getAccessTokenFrom: () => expected
                }
            });

            const cookies = [];

            const req = reqBuilder({});
            const resSpy = resBuilder({
                setHeader: (key, value) => cookies.push(value[0])
            });

            sut.attachCookie(req, resSpy);

            // guard assert
            assert.equal(cookies.length, 1, "Unexpected amount of cookies attached to response");

            const regEx = new RegExp(/.*?=(\w+).*/);
            const result = regEx.exec(cookies[0]);

            assert.equal(result[1], expected, "Unexpected value (or format) of cookie");
        });
        it("attaches cookie with expected expiration", () => {
            const expectedExpirationDate = new Date();
            const actualCookies = [];

            const sut = buildSut({
                requestUtils: {
                    extractExpirationDateFrom: () => expectedExpirationDate
                }
            });

            const req = reqBuilder({});
            const resSpy = resBuilder({
                setHeader: (key, value) => actualCookies.push(value[0])
            });

            sut.attachCookie(req, resSpy);

            // guard assert
            assert.equal(actualCookies.length, 1, "Unexpected amount of cookies attached to response");

            const regEx = new RegExp(/.*?expires=(.*?);.*/);
            const result = regEx.exec(actualCookies[0]);

            assert.equal(result[1], expectedExpirationDate.toUTCString(), "Unexpected expiration (or format) of cookie");
        });
    });

    describe("removeCookie", () => {
        it("attaches cookie with expected name", () => {
            const expected = "foo";

            const sut = buildSut({
                requestUtils: {
                    getIdentityFrom: () => expected,
                }
            });

            const cookies = [];

            const req = reqBuilder({});
            const resSpy = resBuilder({
                setHeader: (key, value) => cookies.push(value[0])
            });

            sut.removeCookie(req, resSpy);

            // guard assert
            assert.equal(cookies.length, 1, "Unexpected amount of cookies attached to response");

            const cookieNameRegEx = new RegExp(/\s*(.*?)=.*/);
            const result = cookieNameRegEx.exec(cookies[0]);

            assert.equal(result[1], expected, "Unexpected name/format of cookie");
        });
        it("attaches cookie with expected value", () => {
            const expected = "";

            const sut = buildSut({});

            const cookies = [];

            const req = reqBuilder({});
            const resSpy = resBuilder({
                setHeader: (key, value) => cookies.push(value[0])
            });

            sut.removeCookie(req, resSpy);

            // guard assert
            assert.equal(cookies.length, 1, "Unexpected amount of cookies attached to response");

            const regEx = new RegExp(/.*?=(.*?);.*/);
            const result = regEx.exec(cookies[0]);

            assert.equal(result[1], expected, "Unexpected value (or format) of cookie");
        });
        it("attaches cookie with expected expiration", () => {
            const expectedExpirationDate = new Date(0);
            const actualCookies = [];

            const sut = buildSut();

            const req = reqBuilder({});
            const resSpy = resBuilder({
                setHeader: (key, value) => actualCookies.push(value[0])
            });

            sut.removeCookie(req, resSpy);

            // guard assert
            assert.equal(actualCookies.length, 1, "Unexpected amount of cookies attached to response");

            const regEx = new RegExp(/.*?expires=(.*?);.*/);
            const result = regEx.exec(actualCookies[0]);

            assert.equal(result[1], expectedExpirationDate.toUTCString(), "Unexpected expiration (or format) of cookie");
        });
    });
});