import express from 'express'
import { getEmployees } from '../controllers/employeesController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.use(authenticate)

router.get('/',authenticate, getEmployees)


export default router
