const db = require("../config/db");

const addVehicle = (req, res) => {
  const {
    reg_no,
    owner_name,
    vehicle_type,
    tax_status,
    toll_category,
    tax_expiry_date,
  } = req.body;

  if (
    !reg_no ||
    !owner_name ||
    !vehicle_type ||
    !tax_status ||
    !toll_category
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const sql = `
    INSERT INTO vehicles
    (reg_no, owner_name, vehicle_type, tax_status, toll_category, tax_expiry_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [reg_no, owner_name, vehicle_type, tax_status, toll_category, tax_expiry_date],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Vehicle Added Successfully",
      });
    }
  );
};

const getVehicleByRegNo = (req, res) => {
  const { reg_no } = req.params;

  const sql = "SELECT * FROM vehicles WHERE reg_no = ?";

  db.query(sql, [reg_no], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Vehicle Not Found",
      });
    }

    res.status(200).json(result[0]);
  });
};

const getAllVehicles = (req, res) => {
  const sql = "SELECT * FROM vehicles";

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

module.exports = {
  addVehicle,
  getVehicleByRegNo,
  getAllVehicles,
};