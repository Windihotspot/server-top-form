import express from 'express'
import onboardingRoutes from './routes/onboarding.routes.js'

const app = express()
app.use(express.json())

app.use('/api/onboarding', onboardingRoutes)

export default app
