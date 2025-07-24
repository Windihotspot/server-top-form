// src/routes/attendanceRoutes.js
import express from 'express'
import {
  getAttendance,
  getAttendanceSummaryByDay
} from '../controllers/attendanceController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/', authenticate, getAttendance)
router.get('/summary', authenticate, getAttendanceSummaryByDay) // 👈 chart data

export default router
