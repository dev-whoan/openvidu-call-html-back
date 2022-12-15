"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.app = void 0;
var crypto = require("crypto");
var express = require("express");
var openvidu_node_client_1 = require("openvidu-node-client");
var config_1 = require("../config");
var OpenViduService_1 = require("../services/OpenViduService");
exports.app = express.Router({
    strict: true
});
var openviduService = OpenViduService_1.OpenViduService.getInstance();
exports.app.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sessionId, nickname, date, sessionCreated, RECORDING_TOKEN_NAME, IS_RECORDING_ENABLED, hasValidToken, isSessionCreator, role, response, cameraConnection, screenConnection, uuid, recordingToken, _a, error_1, error_2, message, code;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 8, , 9]);
                console.log('Session ID received', req.body.sessionId);
                sessionId = req.body.sessionId;
                nickname = req.body.nickname;
                date = null;
                return [4 /*yield*/, openviduService.createSession(sessionId)];
            case 1:
                sessionCreated = _b.sent();
                RECORDING_TOKEN_NAME = openviduService.RECORDING_TOKEN_NAME;
                IS_RECORDING_ENABLED = config_1.CALL_RECORDING.toUpperCase() === 'ENABLED';
                hasValidToken = openviduService.isValidToken(sessionId, req.cookies);
                isSessionCreator = hasValidToken || sessionCreated.activeConnections.length === 0;
                role = isSessionCreator && IS_RECORDING_ENABLED ? openvidu_node_client_1.OpenViduRole.MODERATOR : openvidu_node_client_1.OpenViduRole.PUBLISHER;
                response = { cameraToken: '', screenToken: '', recordingEnabled: IS_RECORDING_ENABLED, recordings: [] };
                return [4 /*yield*/, openviduService.createConnection(sessionCreated, nickname, role)];
            case 2:
                cameraConnection = _b.sent();
                return [4 /*yield*/, openviduService.createConnection(sessionCreated, nickname, role)];
            case 3:
                screenConnection = _b.sent();
                response.cameraToken = cameraConnection.token;
                response.screenToken = screenConnection.token;
                if (IS_RECORDING_ENABLED && isSessionCreator && !hasValidToken) {
                    uuid = crypto.randomBytes(32).toString('hex');
                    date = Date.now();
                    recordingToken = "".concat(response.cameraToken, "&").concat(RECORDING_TOKEN_NAME, "=").concat(uuid, "&createdAt=").concat(date);
                    res.cookie(RECORDING_TOKEN_NAME, recordingToken);
                    openviduService.recordingMap.set(sessionId, { token: recordingToken, recordingId: '' });
                }
                if (!IS_RECORDING_ENABLED) return [3 /*break*/, 7];
                date = date || openviduService.getDateFromCookie(req.cookies);
                _b.label = 4;
            case 4:
                _b.trys.push([4, 6, , 7]);
                _a = response;
                return [4 /*yield*/, openviduService.listRecordingsBySessionIdAndDate(sessionId, date)];
            case 5:
                _a.recordings = _b.sent();
                return [3 /*break*/, 7];
            case 6:
                error_1 = _b.sent();
                if (error_1.message === '501') {
                    console.log('Recording is diasbled in OpenVidu Server. Disabling it in OpenVidu Call');
                    response.recordings = [];
                    response.recordingEnabled = false;
                }
                return [3 /*break*/, 7];
            case 7:
                res.status(200).send(JSON.stringify(response));
                return [3 /*break*/, 9];
            case 8:
                error_2 = _b.sent();
                console.error(error_2);
                message = 'Cannot connect with OpenVidu Server';
                code = Number(error_2 === null || error_2 === void 0 ? void 0 : error_2.message);
                if (error_2.message === 500) {
                    message = 'Unexpected error when creating the Connection object.';
                }
                else if (error_2.message === 404) {
                    message = 'No session exists';
                }
                if (typeof code !== 'number' || Object.entries(error_2).length === 0) {
                    code = 503;
                }
                res.status(code).send({ message: message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=SessionController.js.map