const express = require("express");

const router = express.Router();

const {
  addVehicle,
  getVehicleByRegNo,
  getAllVehicles,
} = require("../controllers/vehicleController");

const {
  updateVehicle,
} = require("../controllers/updateVehicleController");

const {
  deleteVehicle,
} = require("../controllers/deleteVehicleController");

router.post("/", addVehicle);

router.get("/", getAllVehicles);

router.get("/:reg_no", getVehicleByRegNo);

router.put("/:reg_no", updateVehicle);

router.delete("/:reg_no", deleteVehicle);

module.exports = router;