const express = require("express");
const router = express.Router();
const vocabularyController = require("../controllers/vocabulary.ts");
const authMiddleware = require("../middlewares/auth");

router.get("/words", async (req, res) => {
  const result = await vocabularyController.getWords();
  res.json(result);
});

router.get("/groups", async (req, res) => {
  const result = await vocabularyController.getGroups();
  res.json(result);
});

router.get("/progress", authMiddleware, async (req, res) => {
  const userId = Number(req.user.id);
  if (Number.isNaN(userId)) return res.status(400).json({ error: "Invalid user id" });
  const result = await vocabularyController.getUserProgress(userId);
  res.json(result);
});

router.post("/progress", authMiddleware, async (req, res) => {
  const userId = Number(req.user.id);
  if (Number.isNaN(userId)) return res.status(400).json({ error: "Invalid user id" });
  const { wordId, mastery, memorized } = req.body;
  const result = await vocabularyController.updateProgress({ userId, wordId: Number(wordId), mastery: Number(mastery), memorized: !!memorized });
  res.json(result);
});

module.exports = router;
