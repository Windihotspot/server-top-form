import express from 'express'
import { getTeachers } from '../controllers/teachersController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/',authenticate, getTeachers)


export default router
