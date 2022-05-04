const express = require("express");
const router = express.Router();
const {
  createChat,
  getChat,
  addMessage,
} = require("../controllers/chatController");
const { isAuthenticatedUser } = require("../middlewares/authMiddleware");

router.post("/createchat", isAuthenticatedUser, createChat);
router.get("/getchat/:userid/:senderid", isAuthenticatedUser, getChat);
router.put("/chat/:chatid", isAuthenticatedUser, addMessage);

module.exports = router;
