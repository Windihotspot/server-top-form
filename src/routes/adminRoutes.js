import express from 'express'
import {
  getMyProfile,
  updateMyProfile,
  getSchoolAdmins,
} from '../controllers/adminController.js'
import { authenticate } from '../middlewares/authMiddleware.js'

const router = express.Router()

// GET /api/admins/me - Get own profile
router.get('/me', authenticate, getMyProfile)

// PUT /api/admins/me - Update own profile
router.put('/me', authenticate, updateMyProfile)

// GET /api/admins - List all admins in the same school
router.get('/', authenticate, getSchoolAdmins)

export default router
