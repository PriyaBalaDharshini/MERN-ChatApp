import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import chatController from '../controllers/chatController.js'


const router = express.Router()

router.post("/access-chat", protect, chatController.accessChat)

export default router