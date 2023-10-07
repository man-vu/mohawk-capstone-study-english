const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const homeController = require("../controllers/home");

/**
 * This handles loading data for Home Page
 */
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const homeSummary = await homeController.getHomeSummary(userId);
  res.json(homeSummary);
});

module.exports = router;