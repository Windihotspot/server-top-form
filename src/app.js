import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import onboardingRoutes from './routes/onboarding.routes.js'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/onboarding', onboardingRoutes)
app.use('/api/auth', authRoutes)

export default app
