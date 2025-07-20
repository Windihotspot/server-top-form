// routes/students.js
import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { getStudents } from '../controllers/students.controller.js';

const router = express.Router();

router.get('/', authenticate, getStudents);

export default router;
