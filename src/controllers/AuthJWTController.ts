import * as crypto from 'crypto';
import * as express from 'express';
import { Request, Response } from 'express';

import { CALL_ADMIN_SECRET, JWT_SECRET, JWT_LIFETIME } from '../config';
import { authorizer } from '../services/AuthService';
import { OpenViduService } from '../services/OpenViduService';

export const app = express.Router({
	strict: true
});

const openviduService = OpenViduService.getInstance();

const hmac256 = (data, secret) => {
    let hmac = crypto.createHmac('sha256', secret);

    hmac.write(data);
    hmac.end();

    return hmac.read().toString('base64url');
}

const base64UrlSafeToString = (base64UrlString) => {
    return Buffer.from(base64UrlString, 'base64url').toString('utf8');
}

const verifyJsonWebToken = (token) => {
    if(!token){
        return false;
    }
    let base64array = token.split('.');

    if(base64array.length != 3){
        return false;
    }
    let _header = base64array[0];
    let _payload = base64array[1];
    let _signature = base64array[2];

    let _data = _header + "." + _payload;
    let _sign = hmac256(_data, JWT_SECRET);

    if(_sign !== _signature){
        return false;
    }
        
    try{
        let _payloadObject = JSON.parse(base64UrlSafeToString(_payload));
        let _lifetime = Number(JWT_LIFETIME) * 1000;
        let _now = Date.now();
        return ( (_payloadObject.timestamp + _lifetime) >= _now);
    } catch (err) {
        return false;
    }
}

app.post('/', async (req: Request, res: Response) => {
	const token = req.headers.authorization;
        if(!token){
            return res.status(403).json({
                success: false,
                message: 'Authentication failed'
            });
        }

	let jwtToken = token.split(" ")[1];
        let verifyResult = verifyJsonWebToken(jwtToken);
        if(!verifyResult){
            return res.status(403).json({
                code: 403,
                success: false,
                message: 'Token is invalid'
            });
        }
            
        return res.status(200).json({
            code: 200,
            success: true,
            message: 'Token is valid'
        });
});

export {
	verifyJsonWebToken
};
