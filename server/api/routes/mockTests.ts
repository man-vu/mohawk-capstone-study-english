import express from "express";
import mockTestsController from "../controllers/mockTests";

const router = express.Router();

router.get("/", async (req, res) => {
  const result = await mockTestsController.getTests();
  res.json(result);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const result = await mockTestsController.getTest(id);
  res.json(result);
});

export default router;
