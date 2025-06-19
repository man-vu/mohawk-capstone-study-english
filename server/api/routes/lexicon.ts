const express = require("express");
const router = express.Router();
const lexiconController = require("../controllers/lexicon.ts");
const authMiddleware = require("../middlewares/auth");

router.get("/words", async (req, res) => {
  const { type } = req.query;
  const result = await lexiconController.getWords(type as string | undefined);
  res.json(result);
});

router.get("/groups", async (req, res) => {
  const { type } = req.query;
  const result = await lexiconController.getGroups(type as string | undefined);
  res.json(result);
});

router.get("/progress", authMiddleware, async (req, res) => {
  const userId = Number(req.user.id);
  if (Number.isNaN(userId)) return res.status(400).json({ error: "Invalid user id" });
  const result = await lexiconController.getUserProgress(userId);
  res.json(result);
});

router.post("/progress", authMiddleware, async (req, res) => {
  const userId = Number(req.user.id);
  if (Number.isNaN(userId)) return res.status(400).json({ error: "Invalid user id" });
  const { lexiconId, mastery, memorized } = req.body;
  const result = await lexiconController.updateProgress({ userId, lexiconId: Number(lexiconId), mastery: Number(mastery), memorized: !!memorized });
  res.json(result);
});

module.exports = router;
