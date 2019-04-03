import connect from "connect";
import http from "http";
import Configuration from "./components/configuration";

const configuration = new Configuration();
const app = connect();


// register middleware here...
import { createHandler as modeAppenderMiddleware } from "./components/middleware-mode-header";
app.use(modeAppenderMiddleware());



import { createHandler as realProxyMiddleware } from "./components/middleware-proxy";
app.use(realProxyMiddleware({ target: configuration.target }));


http.createServer(app).listen(configuration.port, () => {
    console.log(`Proxy server started on port ${configuration.port} and proxying ${configuration.target}`);
});