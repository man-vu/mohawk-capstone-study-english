const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const discussionController = require("../controllers/discussion");

/**
 * This handles loading data for Discussion Page
 */
router.get("/", async (req, res) => {
  const threads = await discussionController.getDataForDiscussion()

  res.status(200).json(threads)
});

/**
 * This handles filtering threads for Discussion Page
 */
router.post("/search", async (req, res) => {
  const quizId = req.body.quizId
  const userId = req.body.userId
  const dateCreated = req.body.dateCreated
  const subject = req.body.subject

  const threads = await discussionController.findThreads({subject, quizId, userId, dateCreated})

  res.status(200).json(threads)
})

module.exports = router;