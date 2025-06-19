const express = require("express");
const router = express.Router();
const phrasalVerbController = require("../controllers/phrasalVerbs.ts");

router.get("/groups", async (req, res) => {
  const result = await phrasalVerbController.getGroups();
  res.json(result);
});

module.exports = router;
