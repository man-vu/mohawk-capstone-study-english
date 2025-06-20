import express from "express";
import questionsController from "../controllers/questions";
import authMiddleware from "../middlewares/auth";

const router = express.Router();

// POST: [routes/questions]
// Create a new question
router.post("/", authMiddleware, async (req, res) => {
  const data = {
    typeId: req.body.typeId,
    items: req.body.items,
    question: req.body.question,
    instruction: req.body.instruction,
    isActive: req.body.isActive,
    paragraphTitle: !!req.body.paragraphTitle ? null : req.body.paragraphTitle,
    correctAnswers: req.body.correctAnswers,
    shuffleAnswers: req.body.shuffleAnswers ? req.body.shuffleAnswers : 1,
    quizId: Number(req.body.quizId)
  };

  if (Number.isNaN(data.quizId)) {
    return res.status(400).json({ error: "Invalid quiz id" });
  }

  const question = await questionsController.createQuestion(data)

  res.json(question)
});

// POST: [routes/questions]
// Create a new answer
router.put("/answer/:id", authMiddleware, async (req, res) => {
  const data = {
    questionId: Number(req.params.id),
    attemptId: Number(req.body.attemptId),
    quizId: Number(req.body.quizId),
    userId: Number(req.user.id),
    answerText: req.body.answerText
  };

  if (Number.isNaN(data.questionId) || Number.isNaN(data.attemptId) || Number.isNaN(data.quizId) || Number.isNaN(data.userId)) {
    return res.status(400).json({ error: "Invalid identifiers" });
  }

  const answer = await questionsController.updateAnswer(data)

  res.json(answer)
});

export default router;
