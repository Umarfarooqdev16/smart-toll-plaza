const express = require("express");

const router = express.Router();

const {
  getMonthlyReport,
} = require("../controllers/monthlyReportController");

router.get("/", getMonthlyReport);

module.exports = router;