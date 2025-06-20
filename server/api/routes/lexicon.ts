import express from "express";
import lexiconController from "../controllers/lexicon";
import authMiddleware from "../middlewares/auth";

const router = express.Router();

router.get("/words", async (req, res) => {
  const { type, limit } = req.query as { type?: string; limit?: string };
  const parsedLimit = limit ? Number(limit) : undefined;
  const result = await lexiconController.getWords(type, parsedLimit);
  res.json(result);
});

router.get("/groups", async (req, res) => {
  const { type, limit } = req.query as { type?: string; limit?: string };
  const parsedLimit = limit ? Number(limit) : undefined;
  const result = await lexiconController.getGroups(type as string | undefined, parsedLimit);
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

export default router;
