import * as cookieParser from 'cookie-parser';
import * as cookieSession from 'cookie-session';
import * as dotenv from 'dotenv';
import * as express from 'express';

import { app as authController } from './controllers/AuthController';
import { app as authJwtController } from './controllers/AuthJWTController';
import { app as callController } from './controllers/CallController';
import { app as recordingController, proxyGETRecording } from './controllers/RecordingController';
import { app as sessionController } from './controllers/SessionController';
import { app as connectionController } from './controllers/ConnectionController';
import { authorizer } from './services/AuthService';

import {
	CALL_ADMIN_SECRET,
	CALL_OPENVIDU_CERTTYPE,
	CALL_PRIVATE_ACCESS,
	CALL_RECORDING,
	CALL_SECRET,
	CALL_USER,
	MEETING_HOME,
	OPENVIDU_SECRET,
	OPENVIDU_URL,
	JWT_SECRET,
	JWT_LIFETIME,
	SERVER_PORT
} from './config';

dotenv.config();
const app = express();

app.use(MEETING_HOME, express.static(__dirname + '/public/html'));
app.use('/resource/js', express.static(__dirname + '/public/js'));
app.use('/resource/css', express.static(__dirname + '/public/css'));
app.use('/resource/img', express.static(__dirname + '/public/img'));
app.use(express.json());
app.use(cookieParser());
app.use(
	cookieSession({
		name: 'session',
		keys: [CALL_ADMIN_SECRET],
		maxAge: 24 * 60 * 60 * 1000 // 24 hours
	})
);

app.use('/call', callController);
app.use('/sessions/', authorizer, connectionController);
app.use('/sessions', authorizer, sessionController);
app.use('/recordings', authorizer, recordingController);
app.use('/recordings/:recordingId', authorizer, proxyGETRecording);
app.use('/auth/verify', authJwtController);
app.use('/auth', authController);

// Accept selfsigned certificates if CALL_OPENVIDU_CERTTYPE=selfsigned
if (CALL_OPENVIDU_CERTTYPE === 'selfsigned') {
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}
app.listen(SERVER_PORT, () => {
	console.log('---------------------------------------------------------');
	console.log(' ');
	console.log(`OPENVIDU URL: ${OPENVIDU_URL}`);
    console.log(`OPENVIDU_MEETING_ROOM_URL: ${OPENVIDU_URL}${MEETING_HOME}`);
	console.log(`OPENVIDU SECRET: ${OPENVIDU_SECRET}`);
	console.log(`CALL OPENVIDU CERTTYPE: ${CALL_OPENVIDU_CERTTYPE}`);
	console.log(`CALL PRIVATE ACCESS: ${CALL_PRIVATE_ACCESS}`);
	if (CALL_PRIVATE_ACCESS === 'ENABLED') {
		console.log(`CALL USER: ${CALL_USER}`);
		console.log(`CALL SECRET: ${CALL_SECRET}`);
	}
	console.log(`CALL RECORDING: ${CALL_RECORDING}`);
	console.log(`CALL ADMIN PASSWORD: ${CALL_ADMIN_SECRET}`);
	console.log(`JWT  PASSWORD: ${JWT_SECRET}`);
	console.log(`JWT  LIFETIME: ${JWT_LIFETIME}`);
	console.log(`OpenVidu Call Server is listening on port ${SERVER_PORT}`);
	console.log(' ');
	console.log('---------------------------------------------------------');
});
