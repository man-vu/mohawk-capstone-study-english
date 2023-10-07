const express = require("express");
const router = express.Router();
const questionsController = require("../controllers/questions");
const authMiddleware = require("../middlewares/auth");

// GET: [routes/questions]
// Get question by id
router.get("/:id", authMiddleware, async (req, res) => {
  const id = req.params.id;

  const question = await questionsController.getQuestion(id);

  res.json(question);
});

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
    quizId: req.body.quizId
  };

  const question = await questionsController.createQuestion(data)

  res.json(question)
});

// POST: [routes/questions]
// Create a new answer
router.put("/answer/:id", authMiddleware, async (req, res) => {
  const data = {
    questionId: req.params.id,
    attemptId: req.body.attemptId,
    quizId: req.body.quizId,
    userId: req.user.id,
    answerText: req.body.answerText 
  };

  const answer = await questionsController.updateAnswer(data)

  res.json(answer)
});

module.exports = router;
