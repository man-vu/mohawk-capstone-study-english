const router = require('express').Router();
const controller = require('../controllers/courses.ts');

router.get('/', async (_req, res) => {
  const result = await controller.getCourses();
  res.json(result);
});

module.exports = router;
