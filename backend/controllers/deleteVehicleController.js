const db = require("../config/db");

const deleteVehicle = (req, res) => {
  const { reg_no } = req.params;

  const sql = `
    DELETE FROM vehicles
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
      message: "Vehicle Deleted Successfully",
    });
  });
};

module.exports = {
  deleteVehicle,
};