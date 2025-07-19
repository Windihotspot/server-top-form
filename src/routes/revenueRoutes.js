import express from 'express'
import { getRevenue } from '../controllers/revenueController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/',authenticate, getRevenue)


export default router
