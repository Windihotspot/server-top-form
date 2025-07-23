import express from 'express'
import {
  getEarnings,
  getEarningsByMonth,
  getEarningsSummaryByDay // ✅ import
} from '../controllers/earningsController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/', getEarnings)
router.get('/by-month', getEarningsByMonth)
router.get('/summary', getEarningsSummaryByDay) // ✅ new route here

export default router
