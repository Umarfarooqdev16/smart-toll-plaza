const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
  importExcel,
} = require("../controllers/excelController");

router.post(
  "/import",
  upload.single("file"),
  importExcel
);

module.exports = router;