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
