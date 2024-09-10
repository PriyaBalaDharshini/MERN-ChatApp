import express from 'express'
import userController from '../controllers/userController.js'
import protect from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get("/find-user", protect, userController.allUsers)

router.post("/register", userController.registerUser)
router.post("/login", userController.loginUser)



export default router