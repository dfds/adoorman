const mocha = require("mocha");
const assert = require("assert");
const { getAccessToken } = require("./../components/request-utils");

describe("request utils", function() {
    describe("getAccessToken", function() {

        it("returns expected when no access token is available", function() {
            const emptyRequestObject = { };
            assert.equal(getAccessToken(emptyRequestObject), null, "Expected to have null returned");
        });

        it("returns expected access token when available", function() {
            const req = { "x-amzn-oidc-accesstoken": "foo" };
            assert.equal(getAccessToken(req), "foo", "Unexpected access token returned");
        });

        it("returns expected when request is null", function() {
            const req = null;
            assert.equal(getAccessToken(req), null, "Expected to have null returned");
        });

        
    });
});