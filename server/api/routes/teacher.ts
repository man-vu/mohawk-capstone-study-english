import express from "express";
import authTeacherMiddleware from "../middlewares/authTeacher";
import teacherController from "../controllers/teacher";

const router = express.Router();

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
  const quizId = Number(req.params.id)
  if (Number.isNaN(quizId)) {
    return res.status(400).json({ error: "Invalid quiz id" })
  }
  const quiz = await teacherController.getQuizForEdit(quizId)
  res.status(200).json(quiz)
})

/**
 * Route that deletes a quiz
 */
router.delete("/quizzes/:id", authTeacherMiddleware, async (req, res) => {
  const quizId = Number(req.params.id)
  if (Number.isNaN(quizId)) {
    return res.status(400).json({ error: "Invalid quiz id" })
  }
  const quiz = await teacherController.deleteQuiz(quizId)
  res.status(200).json(quiz)
})

/**
 * Route that reset a quiz ratings
 */
router.delete("/quizzes/rating/:id", authTeacherMiddleware, async (req, res) => {
  const quizId = Number(req.params.id)
  if (Number.isNaN(quizId)) {
    return res.status(400).json({ error: "Invalid quiz id" })
  }
  const quiz = await teacherController.resetRatings(quizId)
  res.status(200).json(quiz)
})

/**
 * Route that deletes a question
 */
router.delete("/questions/:id", authTeacherMiddleware, async (req, res) => {
  const questionId = Number(req.params.id)
  if (Number.isNaN(questionId)) {
    return res.status(400).json({ error: "Invalid question id" })
  }
  const quiz = await teacherController.deleteQuestion(questionId)
  res.status(200).json(quiz)
})

/**
 * Route that loads a question
 */
router.get("/questions/:id", authTeacherMiddleware, async (req, res) => {
  const questionId = Number(req.params.id)
  if (Number.isNaN(questionId)) {
    return res.status(400).json({ error: "Invalid question id" })
  }
  const question = await teacherController.getQuestionForEdit(questionId)
  res.status(200).json(question)
})

/**
 * Route that updates a question
 */
router.put("/questions/:id", authTeacherMiddleware, async (req, res) => {
  const questionId = Number(req.params.id)
  if (Number.isNaN(questionId)) {
    return res.status(400).json({ error: "Invalid question id" })
  }
  const question = await teacherController.updateQuestion(req.body)
  res.status(200).json(question)
})

export default router;
