const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

const {
  getVehicleDistribution,
} = require("../controllers/vehicleDistributionController");

const {
  getDailyCrossings,
} = require("../controllers/dailyCrossingsController");

const {
  getPeakHours,
} = require("../controllers/peakHourController");

const verifyToken = require("../middleware/authMiddleware");

router.get("/", getDashboardStats);

router.get(
  "/vehicle-distribution",
  getVehicleDistribution
);

router.get(
  "/daily-crossings",
  getDailyCrossings
);

router.get(
  "/peak-hours",
  getPeakHours
);

module.exports = router;