"use strict";
exports.__esModule = true;
exports.CALL_RECORDING = exports.CALL_ADMIN_SECRET = exports.CALL_SECRET = exports.CALL_USER = exports.CALL_PRIVATE_ACCESS = exports.CALL_OPENVIDU_CERTTYPE = exports.OPENVIDU_SECRET = exports.OPENVIDU_URL = exports.SERVER_PORT = void 0;
exports.SERVER_PORT = process.env.SERVER_PORT || 5000;
exports.OPENVIDU_URL = process.env.OPENVIDU_URL || 'http://localhost:4443';
exports.OPENVIDU_SECRET = process.env.OPENVIDU_SECRET || 'MY_SECRET';
exports.CALL_OPENVIDU_CERTTYPE = process.env.CALL_OPENVIDU_CERTTYPE || 'selfsigned';
exports.CALL_PRIVATE_ACCESS = process.env.CALL_PRIVATE_ACCESS || 'ENABLED';
exports.CALL_USER = process.env.CALL_USER || 'admin';
exports.CALL_SECRET = process.env.CALL_SECRET || exports.OPENVIDU_SECRET;
exports.CALL_ADMIN_SECRET = process.env.CALL_ADMIN_SECRET || exports.OPENVIDU_SECRET;
exports.CALL_RECORDING = process.env.CALL_RECORDING || 'ENABLED';
//# sourceMappingURL=config.js.map