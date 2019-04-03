import assert from "assert";
import ProxyMiddleware from "./../components/middleware-proxy";

describe("ProxyMiddleware", () => {

    it("invokes proxy factory with requested target", () => {
        const expectedTarget = "foo";
        let requestedTarget = null;

        const factoryStub = (target) => { requestedTarget = target; };

        const sut = new ProxyMiddleware({ proxyFactory: factoryStub, target: expectedTarget});

        assert.equal(requestedTarget, expectedTarget, `Expected target of ${expectedTarget} but got ${requestedTarget}`);
    });

    it("acts as the last middleware", () => {
        let wasNextInvoked = false;
        
        const proxyDummy = { web: () => {}};
        const factoryStub = () => proxyDummy;
        
        const sut = new ProxyMiddleware({
            proxyFactory: factoryStub
        });

        const reqDummy = {};
        const resDummy = {};
        const nextSpy = () => wasNextInvoked = true;

        sut.handle(reqDummy, resDummy, nextSpy);

        assert.equal(wasNextInvoked, false, "Unexpected invocation if next callback");
    });

});