import assert from "assert";
import RequestUtils, { headerNames } from "./../components/request-utils";

const reqBuilder = (options) => {
    const defaults = {
        headers: {},
        setHeader: function(name, value) {
            this.headers[name] = value;
        }
    };
    return {...defaults, ...options};
};

const buildSut = (options) => {
    const defaults = {
        jwtUtils: {
            deserialize: () => null
        }
    };

    options = {...defaults, ...options};
    options.jwtUtils = {...defaults.jwtUtils, ...options.jwtUtils};

    return new RequestUtils(options);
};

describe("RequestUtils", () => {
    describe("getIdentityFrom", () => {

        it("returns expected when identity is NOT available in request", () => {
            const expected = null;

            const sut = buildSut();

            const req = reqBuilder();
            const result = sut.getIdentityFrom(req);

            assert.equal(result, expected, `Expected "${expected}" but got "${result}"`);
        });

        it("returns expected identity from request when available", () => {
            const expected = "foo";

            const req = reqBuilder();
            req.setHeader(headerNames.identity, expected);

            const sut = buildSut();
            const result = sut.getIdentityFrom(req);

            assert.equal(result, expected, `Expected "${expected}" but got "${result}"`);
        });

    });

    describe("getAccessTokenFrom", () => {

        it("returns expected when access token is NOT available in request", () => {
            const expected = null;

            const sut = buildSut();

            const req = reqBuilder();
            const result = sut.getAccessTokenFrom(req);

            assert.equal(result, expected, `Expected "${expected}" but got "${result}"`);
        });

        it("returns expected access token from request when available", () => {
            const expected = "foo";

            const req = reqBuilder();
            req.setHeader(headerNames.accessToken, expected);

            const sut = buildSut();
            const result = sut.getAccessTokenFrom(req);

            assert.equal(result, expected, `Expected "${expected}" but got "${result}"`);
        });

    });

    describe("extractExpirationDateFrom", () => {

        it("returns expected when NOT available", () => {
            const expected = null;

            const sut = buildSut();

            const reqStub = reqBuilder();
            const result = sut.extractExpirationDateFrom(reqStub);

            assert.equal(result, expected, `Expected "${expected}" but got "${result}"`);
        });

        it("returns expected when available", () => {
            const expirationAsUnixTimestampStub = Math.floor(new Date().getTime()/1000);
            const expected = expirationAsUnixTimestampStub*1000;

            const sut = buildSut({
                jwtUtils: { deserialize: () => {
                    return { exp: expirationAsUnixTimestampStub };
                }}
            });

            const reqStub = reqBuilder();
            reqStub.setHeader(headerNames.jwt, "dummy-jwt");

            const result = sut.extractExpirationDateFrom(reqStub).getTime();

            assert.equal(result, expected, `Expected "${expected}" but got "${result}"`);
        });

    });
});