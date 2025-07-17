import express from 'express'
import { createOnboarding } from '../controllers/onboarding.controller.js'

const router = express.Router()

router.post('/', createOnboarding)

export default router
