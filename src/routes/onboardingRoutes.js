import express from 'express'
import { createOnboarding } from '../controllers/onboardingController.js'

const router = express.Router()

router.post('/', createOnboarding)

export default router
