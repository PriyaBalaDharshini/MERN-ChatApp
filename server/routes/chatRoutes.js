import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import chatController from '../controllers/chatController.js'


const router = express.Router()

router.get("/fetch-chat", protect, chatController.fetchChat)

router.post("/access-chat", protect, chatController.accessChat)
router.post("/create-group", protect, chatController.createGroupChat)

router.put("/rename-group", protect, chatController.renameGroup)
router.put("/addto-group", protect, chatController.addToGroup)
router.put("/removefrom-group", protect, chatController.removeFromGroup)


export default router