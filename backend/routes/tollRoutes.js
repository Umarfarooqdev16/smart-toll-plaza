const express = require("express");

const router = express.Router();

const {
  calculateToll,
} = require("../controllers/tollController");

router.get("/:reg_no", calculateToll);

module.exports = router;