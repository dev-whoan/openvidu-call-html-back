"use strict";
exports.__esModule = true;
var cookieParser = require("cookie-parser");
var cookieSession = require("cookie-session");
var dotenv = require("dotenv");
var express = require("express");
var AuthController_1 = require("./controllers/AuthController");
var CallController_1 = require("./controllers/CallController");
var RecordingController_1 = require("./controllers/RecordingController");
var SessionController_1 = require("./controllers/SessionController");
var AuthService_1 = require("./services/AuthService");
var config_1 = require("./config");
dotenv.config();
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: [config_1.CALL_ADMIN_SECRET],
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));
app.use('/call', CallController_1.app);
app.use('/sessions', AuthService_1.authorizer, SessionController_1.app);
app.use('/recordings', AuthService_1.authorizer, RecordingController_1.app);
app.use('/recordings/:recordingId', AuthService_1.authorizer, RecordingController_1.proxyGETRecording);
app.use('/auth', AuthController_1.app);
// Accept selfsigned certificates if CALL_OPENVIDU_CERTTYPE=selfsigned
if (config_1.CALL_OPENVIDU_CERTTYPE === 'selfsigned') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
app.listen(config_1.SERVER_PORT, function () {
    console.log('---------------------------------------------------------');
    console.log(' ');
    console.log("OPENVIDU URL: ".concat(config_1.OPENVIDU_URL));
    console.log("OPENVIDU SECRET: ".concat(config_1.OPENVIDU_SECRET));
    console.log("CALL OPENVIDU CERTTYPE: ".concat(config_1.CALL_OPENVIDU_CERTTYPE));
    console.log("CALL PRIVATE ACCESS: ".concat(config_1.CALL_PRIVATE_ACCESS));
    if (config_1.CALL_PRIVATE_ACCESS === 'ENABLED') {
        console.log("CALL USER: ".concat(config_1.CALL_USER));
        console.log("CALL SECRET: ".concat(config_1.CALL_SECRET));
    }
    console.log("CALL RECORDING: ".concat(config_1.CALL_RECORDING));
    console.log("CALL ADMIN PASSWORD: ".concat(config_1.CALL_ADMIN_SECRET));
    console.log("OpenVidu Call Server is listening on port ".concat(config_1.SERVER_PORT));
    console.log(' ');
    console.log('---------------------------------------------------------');
});
//# sourceMappingURL=app.js.map