const express = require("express");
const router = express.Router();
const writingController = require("../controllers/writing.ts");
const authMiddleware = require("../middlewares/auth");

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

module.exports = router;
