const express = require("express");

const router = express.Router();

const {
  getAIInsights,
} = require("../controllers/aiController");

router.get("/", getAIInsights);

module.exports = router;