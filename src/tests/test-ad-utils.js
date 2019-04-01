const mocha = require("mocha");
const assert = require("assert");
const Sut = require("./../components/ad-utils");

describe("AdUtils", () => {
    describe("getAdGroups", () => {

        it("returns expected from provider", () => {
            const expected = ["foo", "bar"];
            const providerStub = () => expected;

            const sut = new Sut(providerStub);
            const result = sut.getAdGroups();

            assert.deepEqual(result, expected, `Expected ${JSON.stringify(expected)} but got ${JSON.stringify(result)}`)
        });
    
    });
});