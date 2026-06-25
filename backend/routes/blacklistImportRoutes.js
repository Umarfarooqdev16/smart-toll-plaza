const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  importBlacklist,
} = require("../controllers/blacklistImportController");

router.post(
  "/import",
  upload.single("file"),
  importBlacklist
);

module.exports = router;