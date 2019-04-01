const mocha = require("mocha");
const assert = require("assert");
const { timeProvider, setTimeProvider } = require("./../components/system-time");
const { getCookieExpirationTime:sut } = require("./../components/request-utils");

describe("request utils", function() {
    describe("getCookieExpirationTime", function() {

        it("returns expected when request is null", function() {
            const req = null;
            assert.equal(sut(req), null, "Expected to have null returned");
        });
        
        it("returns expected when no jwt is available", function() {
            const emptyRequestObject = { };
            assert.equal(sut(emptyRequestObject), null, "Expected to have null returned");
        });

        it("returns expected access token when available", function() {
            const req = { "x-amzn-oidc-accesstoken": "foo" };
            assert.equal(sut(req), "foo", "Unexpected access token returned");
        });

    });
});