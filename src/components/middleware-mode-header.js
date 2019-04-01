module.exports = function (options) {
    const cfg = Object.assign({ headerName: "x-adoorman-mode" }, options);
    const middleware = (req, res, next) => {
        next();
        res.setHeader(cfg.headerName, "passthrough");    
    };

    return middleware;
};