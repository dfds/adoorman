const jwt = require('jsonwebtoken');

module.exports = function (inputJwt) {
    return jwt.decode(inputJwt);
};