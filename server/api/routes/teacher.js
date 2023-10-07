const express = require("express");
const router = express.Router();
const authTeacherMiddleware = require("../middlewares/authTeacher");
const teacherController = require("../controllers/teacher");

/**
 * Route that gets teacher home 
 */
router.get("/", authTeacherMiddleware, async (req, res) => {
  const teacherHome = await teacherController.getTeacherHome()

  res.status(200).json(teacherHome)
});

/**
 * * Route that gets all quizzes
 */
router.get("/quizzes/:id", authTeacherMiddleware, async (req, res) => {
  const quizId = req.params.id
  const quiz = await teacherController.getQuizForEdit(quizId)
  res.status(200).json(quiz)
})

/**
 * Route that deletes a quiz
 */
router.delete("/quizzes/:id", authTeacherMiddleware, async (req, res) => {
  const quizId = req.params.id
  const quiz = await teacherController.deleteQuiz(quizId)
  res.status(200).json(quiz)
})

/**
 * Route that reset a quiz ratings
 */
router.delete("/quizzes/rating/:id", authTeacherMiddleware, async (req, res) => {
  const quizId = req.params.id
  const quiz = await teacherController.resetRatings(quizId)
  res.status(200).json(quiz)
})

/**
 * Route that deletes a question
 */
router.delete("/questions/:id", authTeacherMiddleware, async (req, res) => {
  const questionId = req.params.id
  const quiz = await teacherController.deleteQuestion(questionId)
  res.status(200).json(quiz)
})

/**
 * Route that loads a question
 */
router.get("/questions/:id", authTeacherMiddleware, async (req, res) => {
  const questionId = req.params.id
  const question = await teacherController.getQuestionForEdit(questionId)
  res.status(200).json(question)
})

/**
 * Route that updates a question
 */
router.put("/questions/:id", authTeacherMiddleware, async (req, res) => {
  const questionId = req.params.id
  const question = await teacherController.updateQuestion(req.body)
  res.status(200).json(question)
})

module.exports = router;
