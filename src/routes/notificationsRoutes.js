import express from 'express'
import { getNotifications } from '../controllers/notificationsController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/', getNotifications)

export default router
