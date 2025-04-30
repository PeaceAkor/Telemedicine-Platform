import express from "express";
import {
  createMessage,
  getMessages,
} from "../controllers/messageController.mjs";

const messageRouter = express.Router();

//  routes
messageRouter.post("/", createMessage);
messageRouter.get("/:roomId", getMessages);

export default messageRouter;
