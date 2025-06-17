const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const homeController = require("../controllers/home.ts");

/**
 * This handles loading data for Home Page
 */
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user ? Number(req.user.id) : null;
  if (req.user && Number.isNaN(userId)) {
    return res.status(400).json({ error: "Invalid user id" });
  }
  const homeSummary = await homeController.getHomeSummary(userId);
  res.json(homeSummary);
});

module.exports = router;

