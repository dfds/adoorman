const mocha = require("mocha");
const assert = require("assert");
const middleware = require("../components/middleware-mode-header");

describe("add mode-header middleware", function() {

    it("adds expected header to response", function() {
        let header = { };

        const requestDummy = { };
        const responseSpy = {
            setHeader: (key, value) => header =  { key: key, value: value}
        };
        const nextCallbackDummy = () => { };

        const sut = middleware();
        sut(requestDummy, responseSpy, nextCallbackDummy);

        const expected = { key: "x-adoorman-mode", value: "passthrough" };
        
        assert.deepEqual(header, expected, `Expected header ${JSON.stringify(expected)} but got ${JSON.stringify(header)}`);
    });

    it("invokes the next middleware component", function () {
        let wasNextInvoked = false;

        const requestDummy = { };
        const responseDummy = { setHeader: () => {} };
        const nextCallbackSpy = () => { wasNextInvoked = true };

        const sut = middleware();
        sut(requestDummy, responseDummy, nextCallbackSpy);

        assert.equal(wasNextInvoked, true, "Expected next callback to be invoked.");
    });

    it("invokes the next middleware component BEFORE setting the response header", function () {
        const callbackOrder = new Array();

        const requestDummy = { };
        const responseSpy = { setHeader: () => callbackOrder.push("setHeader") };
        const nextCallbackSpy = () => { callbackOrder.push("next") };

        const sut = middleware();
        sut(requestDummy, responseSpy, nextCallbackSpy);

        const expectedCallbackOrder = ["next", "setHeader"];
        assert.deepEqual(callbackOrder, expectedCallbackOrder, "Expected next to be invoked first");
    });

});