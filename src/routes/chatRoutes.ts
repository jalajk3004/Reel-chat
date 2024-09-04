import express from "express";

const chatRouter = express.Router()

chatRouter.get('/chatsection', (req, res) => {
  res.send('chat');
});

export default chatRouter;

