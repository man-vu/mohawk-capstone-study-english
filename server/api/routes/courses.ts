import express from 'express';
import controller from '../controllers/courses';

const router = express.Router();

router.get('/', async (_req, res) => {
  const result = await controller.getCourses();
  res.json(result);
});

export default router;
