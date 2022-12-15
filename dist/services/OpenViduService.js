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
exports.OpenViduService = void 0;
var openvidu_node_client_1 = require("openvidu-node-client");
var config_1 = require("../config");
var OpenViduService = /** @class */ (function () {
    function OpenViduService() {
        this.RECORDING_TOKEN_NAME = 'ovCallRecordingToken';
        this.ADMIN_TOKEN_NAME = 'ovCallAdminToken';
        this.recordingMap = new Map();
        this.adminTokens = [];
        this.openvidu = new openvidu_node_client_1.OpenVidu(config_1.OPENVIDU_URL, config_1.OPENVIDU_SECRET);
    }
    OpenViduService.getInstance = function () {
        if (!OpenViduService.instance) {
            OpenViduService.instance = new OpenViduService();
        }
        return OpenViduService.instance;
    };
    OpenViduService.prototype.getBasicAuth = function () {
        return this.openvidu.basicAuth;
    };
    OpenViduService.prototype.getDateFromCookie = function (cookies) {
        try {
            var cookieToken = cookies[this.RECORDING_TOKEN_NAME];
            if (!!cookieToken) {
                var cookieTokenUrl = new URL(cookieToken);
                var date = cookieTokenUrl === null || cookieTokenUrl === void 0 ? void 0 : cookieTokenUrl.searchParams.get('createdAt');
                return Number(date);
            }
            else {
                return Date.now();
            }
        }
        catch (error) {
            return Date.now();
        }
    };
    OpenViduService.prototype.getSessionIdFromCookie = function (cookies) {
        try {
            var cookieTokenUrl = new URL(cookies[this.RECORDING_TOKEN_NAME]);
            return cookieTokenUrl === null || cookieTokenUrl === void 0 ? void 0 : cookieTokenUrl.searchParams.get('sessionId');
        }
        catch (error) {
            console.log('Recording cookie not found');
            console.error(error);
            return '';
        }
    };
    OpenViduService.prototype.isValidToken = function (sessionId, cookies) {
        var _a;
        try {
            var storedTokenUrl = new URL((_a = this.recordingMap.get(sessionId)) === null || _a === void 0 ? void 0 : _a.token);
            var cookieTokenUrl = new URL(cookies[this.RECORDING_TOKEN_NAME]);
            if (!!cookieTokenUrl && !!storedTokenUrl) {
                var cookieSessionId = cookieTokenUrl.searchParams.get('sessionId');
                var cookieToken = cookieTokenUrl.searchParams.get(this.RECORDING_TOKEN_NAME);
                var cookieDate = cookieTokenUrl.searchParams.get('createdAt');
                var storedToken = storedTokenUrl.searchParams.get(this.RECORDING_TOKEN_NAME);
                var storedDate = storedTokenUrl.searchParams.get('createdAt');
                return sessionId === cookieSessionId && cookieToken === storedToken && cookieDate === storedDate;
            }
            return false;
        }
        catch (error) {
            return false;
        }
    };
    OpenViduService.prototype.createSession = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            var sessionProperties, session;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('Creating session: ', sessionId);
                        sessionProperties = { customSessionId: sessionId };
                        return [4 /*yield*/, this.openvidu.createSession(sessionProperties)];
                    case 1:
                        session = _a.sent();
                        return [4 /*yield*/, session.fetch()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, session];
                }
            });
        });
    };
    OpenViduService.prototype.createConnection = function (session, nickname, role) {
        console.log("Requesting token for session ".concat(session.sessionId));
        var connectionProperties = { role: role };
        if (!!nickname) {
            connectionProperties.data = JSON.stringify({
                openviduCustomConnectionId: nickname
            });
        }
        console.log('Connection Properties:', connectionProperties);
        return session.createConnection(connectionProperties);
    };
    OpenViduService.prototype.startRecording = function (sessionId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.openvidu.startRecording(sessionId)];
            });
        });
    };
    OpenViduService.prototype.stopRecording = function (recordingId) {
        return this.openvidu.stopRecording(recordingId);
    };
    OpenViduService.prototype.deleteRecording = function (recordingId) {
        return this.openvidu.deleteRecording(recordingId);
    };
    OpenViduService.prototype.getRecording = function (recordingId) {
        return this.openvidu.getRecording(recordingId);
    };
    OpenViduService.prototype.listAllRecordings = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.openvidu.listRecordings()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    OpenViduService.prototype.listRecordingsBySessionIdAndDate = function (sessionId, date) {
        return __awaiter(this, void 0, void 0, function () {
            var recordingList;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.listAllRecordings()];
                    case 1:
                        recordingList = _a.sent();
                        return [2 /*return*/, recordingList.filter(function (recording) { return recording.sessionId === sessionId && date <= recording.createdAt; })];
                }
            });
        });
    };
    return OpenViduService;
}());
exports.OpenViduService = OpenViduService;
//# sourceMappingURL=OpenViduService.js.map