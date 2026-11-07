import { Router } from 'express';
import userRoutes from './user.route';
import companyRoutes from './company.route';
import authRoutes from './auth.route';

const router = Router();

router.use('/user', userRoutes);
router.use('/company', companyRoutes);
router.use('/auth', authRoutes);

export default router;