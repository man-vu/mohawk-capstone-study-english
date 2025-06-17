const express = require("express");
const quizzesController = require("../controllers/quizzes.ts");
const authMiddleware = require("../middlewares/auth");
const authTeacherMiddleware = require("../middlewares/authTeacher");
const router = express.Router();

/**
 * Route that handles starting a quiz
 */
router.post("/start/:id", authMiddleware, async (req, res) => {
  const quizId = parseInt(req.params.id, 10);
  const userId = req.user.id;

  const quiz = await quizzesController.startQuiz(quizId, userId);
  res.status(200).json(quiz);
});

/**
 * Route that loads a quiz
 */
router.get("/:id", authMiddleware, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const quiz = await quizzesController.getQuiz(id);
  res.status(200).json(quiz);
});

/**
 * Route that creates a quiz
 */
router.post("/", [authMiddleware, authTeacherMiddleware], async (req, res) => {
  const data = {
    courseName: req.body.courseName,
    description: req.body.description,
    isActive: req.body.isActive,
    timeAllowed: req.body.timeAllowed,
    skillId: req.body.skillId,
    userId: req.user.id,
  };

  const quiz = await quizzesController.createQuiz(data);

  res.json(quiz);
});

/**
 * Route that updates a quiz
 */
router.put("/:id", [authMiddleware, authTeacherMiddleware], async (req, res) => {
  const data = {
    quizId: parseInt(req.params.id, 10),
    courseName: req.body.courseName,
    description: req.body.description,
    isActive: req.body.isActive,
    timeAllowed: req.body.timeAllowed,
    skillId: req.body.skillId,
    userId: req.user.id,
  };

  const quiz = await quizzesController.updateQuiz(data);

  res.status(200).json(quiz);
});

/**
 * Route that toggles user favorites for a quiz
 */
router.put("/:id/favorite", authMiddleware, async (req, res) => {
  let quizId = parseInt(req.params.id, 10);
  const userId = req.user.id;

  const rating = await quizzesController.toggleFavorite({ quizId, userId });

  res.status(200).json(rating);
});

/**
 * Route that sets rating for a quiz
 */
router.put("/:id/rating", authMiddleware, async (req, res) => {
  const quizId = parseInt(req.params.id, 10);
  const userId = req.user.id;
  const ratingGiven = req.body.ratingGiven;

  const rating = await quizzesController.setRating({
    quizId,
    userId,
    ratingGiven,
  });

  res.status(200).json(rating);
});

/**
 * Route that submits a quiz
 */
router.post("/submit", authMiddleware, async (req, res) => {
  const quizId = parseInt(req.body.quizId, 10);
  const attemptId = parseInt(req.body.attemptId, 10);
  const userId = req.user.id;

  const submit = await quizzesController.submitAndMark({
    quizId,
    attemptId,
    userId,
  });

  res.status(200).json(submit);
});

module.exports = router;
