const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  importTransactions,
} = require("../controllers/transactionImportController");

router.post(
  "/import",
  upload.single("file"),
  importTransactions
);

module.exports = router;