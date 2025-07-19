import express from 'express'
import { getExpenses } from '../controllers/expensesController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/', authenticate, getExpenses)


export default router
