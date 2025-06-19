const express = require("express");
const router = express.Router();
const mockTestsController = require("../controllers/mockTests.ts");

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

module.exports = router;
