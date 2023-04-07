import express from 'express';
const conversationRouter = express.Router();
import { newConversation } from '../Controller/conversation-controller';
import { getOneId } from '../Controller/conversation-controller';
import { getAllId } from '../Controller/conversation-controller';
import { getAllInfo } from '../Controller/conversation-controller';

conversationRouter.post("/", newConversation);
conversationRouter.get("/:userId", getOneId);
conversationRouter.get("/find/:firstUserId/:secUserId", getAllId);
conversationRouter.post("/getconversation/:conversationId", getAllInfo);
export default conversationRouter;