import express from 'express';
const messageRouter = express.Router();
import { newMessage } from '../Controller/message-controller';
import { getMessage } from '../Controller/message-controller';

messageRouter.post("/", newMessage);
messageRouter.get("/:conversationId", getMessage)
export default messageRouter;