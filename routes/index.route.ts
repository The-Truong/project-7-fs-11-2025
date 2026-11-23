import { Router } from 'express';
import userRoutes from './user.route';
import companyRoutes from './company.route';
import authRoutes from './auth.route';
import cityRoutes from './city.route';
import searchRoutes from './search.route';
import jobRoutes from './job.route';

const router = Router();

router.use('/user', userRoutes);
router.use('/company', companyRoutes);
router.use('/auth', authRoutes);
router.use('/city', cityRoutes);
router.use('/search', searchRoutes);
router.use('/job', jobRoutes);

export default router;