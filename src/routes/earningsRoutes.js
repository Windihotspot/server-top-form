import express from 'express'
import {
  getEarnings,
  getEarningsByMonth,
  getEarningsSummaryByDay // ✅ import
} from '../controllers/earningsController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/',authenticate, getEarnings)
router.get('/by-month', authenticate, getEarningsByMonth)
router.get('/summary', authenticate, getEarningsSummaryByDay) // ✅ new route here

export default router
