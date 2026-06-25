const express = require("express");

const router = express.Router();

const {
  checkTaxStatus,
} = require("../controllers/taxController");

router.get("/:reg_no", checkTaxStatus);

module.exports = router;