import express from "express"
import protect from "../middlewares/authMiddleware.js"
import messageController from "../controllers/messageController.js"

const router = express.Router()

router.post("/send-message", protect, messageController.sendMessage)
router.get("/:chatId", protect, messageController.allMessages) //all messages of a single chat

export default router