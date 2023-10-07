const express = require("express");
const router = express.Router();
const threadsController = require("../controllers/threads");
const authMiddleware = require("../middlewares/auth");

/**
 * Route that loads a thread
 */
router.get("/:id", async (req, res) => {
  const threadId = req.params.id;
  const thread = await threadsController.getThread(threadId);

  res.json(thread);
});

/**
 * Function loads all threads
 */
router.get("/", async (_req, res) => {
  const threads = await threadsController.getThreads();

  res.json(threads);
});

/**
 * Function that creates a thread
 */
router.post("/", authMiddleware, async (req, res) => {
  let subject = req.body.subject;
  let selectedRelatedQuizId = req.body.selectedRelatedQuizId;
  let description = req.body.description;
  const userId = req.user.id;

  const newThread = await threadsController.createThread({
    subject,
    selectedRelatedQuizId,
    description,
    userId,
  });

  res.json(newThread);
});

module.exports = router;
