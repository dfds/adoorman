const http = require("http");
const httpProxy = require("http-proxy");
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 9321;
const target = process.env.PROXY_TO || "http://localhost:9322";
const expectedAdGroup = process.env.AD_GROUP || "";
const isPassThrough = !expectedAdGroup || expectedAdGroup == "";

if (isPassThrough) {
    console.log("AD_GROUP environment variable NOT set - running as passthrough proxy.");
}

function getBearerTokenFrom(req) {
    let authHeader = req.headers.authorization || "";
    authHeader = authHeader.toString();

    if (authHeader.startsWith("Bearer ") || authHeader.startsWith("bearer ")) {
        return authHeader.slice("Bearer ".length);
    }

    return null;
}

function isAuthorized(req) {
    if (isPassThrough) {
        return true;
    }

    const bearerToken = getBearerTokenFrom(req);
    
    if (bearerToken) {
        const payload = jwt.decode(bearerToken);
        const groups = new Set(payload.groups || []);
        return groups.has(expectedAdGroup);
    }

    return false;
}

const proxy = httpProxy.createProxyServer({ target: target });
const proxyServer = http.createServer((req, res) => {
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

// const realServer = http.createServer((req, res) => {
//     res.writeHead(200, "OK", {
//         "x-was-here": "real"
//     });

//     res.write("Response content from REAL server.");
//     res.end();
// });

// realServer.listen(9322);