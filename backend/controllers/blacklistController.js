const db = require("../config/db");

const checkBlacklist = (req, res) => {
  const { reg_no } = req.params;

  const sql = `
    SELECT *
    FROM blacklisted_vehicles
    WHERE reg_no = ?
  `;

  db.query(sql, [reg_no], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(200).json({
        reg_no,
        status: "CLEAR",
        message: "Vehicle is not blacklisted",
      });
    }

    res.status(200).json({
      reg_no: result[0].reg_no,
      status: "BLACKLISTED",
      reason: result[0].reason,
    });
  });
};

const addToBlacklist = (req, res) => {
  const { reg_no, reason } = req.body;

  const sql = `
    INSERT INTO blacklisted_vehicles (reg_no, reason)
    VALUES (?, ?)
  `;

  db.query(sql, [reg_no, reason], (err) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(201).json({
      message: "Vehicle Blacklisted Successfully",
    });
  });
};

const getBlacklistedVehicles = (req, res) => {
  const sql = `
    SELECT *
    FROM blacklisted_vehicles
    ORDER BY id DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

const removeFromBlacklist = (req, res) => {
  const { reg_no } = req.params;

  const sql = `
    DELETE FROM blacklisted_vehicles
    WHERE reg_no = ?
  `;

  db.query(sql, [reg_no], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Vehicle Not Found",
      });
    }

    res.status(200).json({
      message: "Vehicle Removed From Blacklist",
    });
  });
};

module.exports = {
  checkBlacklist,
  addToBlacklist,
  getBlacklistedVehicles,
  removeFromBlacklist,
};