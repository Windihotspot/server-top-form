import express from 'express'
import { getAttendance } from '../controllers/attendanceController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/',authenticate, getAttendance)


export default router
