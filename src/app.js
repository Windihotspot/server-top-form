import express from 'express'
import cors from 'cors'
import morgan from 'morgan'

import onboardingRoutes from './routes/onboardingRoutes.js'
import authRoutes from './routes/authRoutes.js'
import studentsRoutes from './routes/studentsRoutes.js'
import teachersRoutes from './routes/teachersRoutes.js'
import employeesRoutes from './routes/employeesRoutes.js'
import revenueRoutes from './routes/revenueRoutes.js'
import expensesRoutes from './routes/expensesRoutes.js'
import attendanceRoutes from './routes/attendanceRoutes.js'
import earningsRoutes from  './routes/earningsRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import notificationsRoutes from './routes/notificationsRoutes.js'




const app = express()



app.use(cors())
app.use(morgan('dev'))
app.use(express.json())


// Capture request body
morgan.token('req-body', (req) => JSON.stringify(req.body))

// Capture response body
morgan.token('res-body', (req, res) => res.locals.body || '')

// Middleware to override res.send and capture the response
// app.use((req, res, next) => {
//   const originalSend = res.send.bind(res)
//   res.send = (body) => {
//     res.locals.body = typeof body === 'object' ? JSON.stringify(body) : body
//     return originalSend(body)
//   }
//   next()
// })

// Logging middleware
// app.use(
//   morgan(':method :url :status - req: :req-body - res: :res-body')
// )



app.use('/api/onboarding', onboardingRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/students', studentsRoutes)
app.use('/api/teachers', teachersRoutes)
app.use('/api/employees', employeesRoutes)
app.use('/api/revenue', revenueRoutes)
app.use('/api/expenses', expensesRoutes)
app.use('/api/attendance', attendanceRoutes)
app.use('/api/earnings', earningsRoutes)
app.use('/api/admins', adminRoutes)
app.use('/api/notifications', notificationsRoutes)

export default app
