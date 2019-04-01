function isMemberOfGroups(groups) {
    return false;
}

function hasAuthorizationCookie(req) {
    return false;
}

function attachCookie(res) {

}

function sendRejectResponse(res) {
    res.writeHead(403, "Forbidden");
    res.write("You are not authorized to view this resource.");
    res.end();
}

function isPassthrough() {
    return false;
}

module.exports = function (options) {
    const middleware = (req, res, next) => {

        if (isPassthrough() || hasAuthorizationCookie(req) || isMemberOfGroups(options.groups)) {
            next();
            attachCookie(res);
        } else {
            sendRejectResponse(res);
        }

    };

    return middleware;
};