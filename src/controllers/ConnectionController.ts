import * as express from 'express';
import { Request, Response } from 'express';
import { OpenViduRole, Session, Connection } from 'openvidu-node-client';
import { OpenViduService } from '../services/OpenViduService';

export const app = express.Router({
	strict: true
});

const openviduService = OpenViduService.getInstance();

///:sessionId/connections
app.post("/:sessionId/connection", async (req: Request, res: Response) => {
//    let _sessionId: string = req.body.sessionId;
    let _sessionId: string = req.params.sessionId;
    // "openviduCustomConnectionId"
    let session: Session = openviduService.searchSessionBySessionId(_sessionId);
    /*
        role: OpenViduRole.MODERATOR, OpenViduRole.PUBLISHER, OpenViduRole.SUBSCRIBER
    */
    if (!session) {
      console.log("no session is available..");
      res.status(404).send();
    } else {
      let connection: Connection = await openviduService.createConnection(session, req.body.nickname, OpenViduRole.MODERATOR);
      res.send(connection.token);
    }
});
