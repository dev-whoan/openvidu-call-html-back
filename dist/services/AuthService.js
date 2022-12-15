"use strict";
exports.__esModule = true;
exports.authorizer = void 0;
var timingSafeEqual = require('crypto').timingSafeEqual;
var config_1 = require("../config");
var authorizer = function (req, res, next) {
    if (config_1.CALL_PRIVATE_ACCESS === 'ENABLED') {
        var userAuth = req.headers.authorization;
        var auth = 'Basic ' + Buffer.from("".concat(config_1.CALL_USER, ":").concat(config_1.CALL_SECRET)).toString('base64');
        var validAuth = safeCompare(userAuth, auth);
        if (validAuth) {
            next();
        }
        else {
            console.log('Unauthorized');
            return res.status(401).send('Unauthorized');
        }
    }
    else {
        next();
    }
};
exports.authorizer = authorizer;
function safeCompare(a, b) {
    if (!!a && !!b) {
        var aLength = Buffer.byteLength(a);
        var bLength = Buffer.byteLength(b);
        var aBuffer = Buffer.alloc(aLength, 0, 'utf8');
        aBuffer.write(a);
        var bBuffer = Buffer.alloc(aLength, 0, 'utf8');
        bBuffer.write(b);
        return !!(timingSafeEqual(aBuffer, bBuffer) && aLength === bLength);
    }
    return false;
}
//# sourceMappingURL=AuthService.js.map