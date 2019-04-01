const mocha = require("mocha");
const assert = require("assert");
const Sut = require("./../components/mode-utils");

describe("ModeUtils", () => {

    describe("isPassthrough", () => {
        it("returns expected when nothing has been set", () => {
            const expected = true;
            
            const sut = new Sut();
            const result = sut();
            
            assert.equal(result, expected, `Expected mode to be ${expected} but was ${result}`);
        });

        it("returns expected when provider wants passthrough", () => {
            const expected = modes.passthrough;
            setMode(() => expected);

            const result = sut();
            
            assert.equal(result, expected, `Expected mode to be ${expected} but was ${result}`);
        });

        it("returns expected when provider wants authorize", () => {
            const expected = modes.authorize;
            setMode(() => expected);

            const result = sut();
            
            assert.equal(result, expected, `Expected mode to be ${expected} but was ${result}`);
        });

    });

});