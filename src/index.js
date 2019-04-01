const http = require("http");
const httpProxy = require("http-proxy");
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 9321;
const target = process.env.PROXY_TO || "http://localhost:9322";
const expectedAdGroup = process.env.AD_GROUP || "";
const isPassThrough = !expectedAdGroup || expectedAdGroup == "";
const isDebug = (process.env.DEBUG || "0") == "1";

if (isPassThrough) {
    console.log("AD_GROUP environment variable NOT set - running as passthrough proxy.");
}

function getJwtFrom(req) {
    let authHeader = req.headers["x-amzn-oidc-data"];
    if (authHeader) {
        return authHeader.toString();
    }

    authHeader = (req.headers.authorization || "").toString();
    if (authHeader.startsWith("Bearer ") || authHeader.startsWith("bearer ")) {
        return authHeader.slice("Bearer ".length);
    }

    return null;
}

function isAuthorized(req) {
    if (isPassThrough) {
        return true;
    }

    const bearerToken = getJwtFrom(req);
    
    if (bearerToken) {
        const payload = jwt.decode(bearerToken);
        const groups = new Set(payload.groups || []);

        if (isDebug) {
            console.log("JWT: " + JSON.stringify(payload));
        }

        return groups.has(expectedAdGroup);
    }

    return false;
}

const proxy = httpProxy.createProxyServer({ target: target });
const proxyServer = http.createServer((req, res) => {
    if (isDebug) {
        console.log("Incomming headers: " + JSON.stringify(req.headers));
    }

    res.setHeader("x-adoorman-mode", isPassThrough ? "passthrough" : "authorize");

    if (isAuthorized(req)) {
        proxy.web(req, res);
    } else {
        res.writeHead(403, "Forbidden");
        res.write("Your are not authorized to view this resource.");
        res.end();
    }
});

proxyServer.listen(port);