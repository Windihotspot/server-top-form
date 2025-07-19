// routes/students.js
import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { getStudents } from '../controllers/studentsController.js';

const router = express.Router();

router.get('/', authenticate, getStudents);

export default router;

