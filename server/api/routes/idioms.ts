const express = require("express");
const router = express.Router();
const idiomsController = require("../controllers/idioms.ts");

router.get("/groups", async (req, res) => {
  const result = await idiomsController.getGroups();
  res.json(result);
});

module.exports = router;
