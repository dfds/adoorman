const defaultOptions = { 
    headerName: "x-adoorman-mode" 
};

export default class ModeHeaderMiddleware {
    constructor(options) {
        const cfg =  {...defaultOptions, ...options };

        this.headerName = cfg.headerName;
    }

    handle(req, res, next) {
        next();
        res.setHeader(this.headerName, "passthrough");    
    }
}

export function createHandler(options) {
    const middleware = new ModeHeaderMiddleware(options);
    return middleware.handle;
}