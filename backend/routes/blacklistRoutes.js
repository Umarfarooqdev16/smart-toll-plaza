const express = require("express");

const router = express.Router();

const {
  checkBlacklist,
  addToBlacklist,
  getBlacklistedVehicles,
  removeFromBlacklist,
} = require("../controllers/blacklistController");

router.post("/", addToBlacklist);
router.get("/", getBlacklistedVehicles);
router.get("/:reg_no", checkBlacklist);
router.delete("/:reg_no", removeFromBlacklist);

module.exports = router;