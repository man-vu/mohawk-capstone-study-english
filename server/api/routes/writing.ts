import express from "express";
import writingController from "../controllers/writing";
import authMiddleware from "../middlewares/auth";

const router = express.Router();

router.post("/assess", authMiddleware, async (req, res) => {
  const userEssayAnswerId = Number(req.body.userEssayAnswerId);
  if (Number.isNaN(userEssayAnswerId)) return res.status(400).json({ error: "Invalid id" });
  const scores = req.body;
  const result = await writingController.createAssessment({
    UserEssayAnswer: { connect: { UserAnswerId: userEssayAnswerId } },
    TaskResponseScore: scores.taskResponseScore,
    CoherenceCohesionScore: scores.coherenceCohesionScore,
    LexicalResourcesScore: scores.lexicalResourcesScore,
    GrammaticalAccuracyScore: scores.grammaticalAccuracyScore,
    OverallBand: scores.overallBand,
    EstimatedIELTSScore: scores.estimatedIELTSScore,
  });
  res.json(result);
});

export default router;
