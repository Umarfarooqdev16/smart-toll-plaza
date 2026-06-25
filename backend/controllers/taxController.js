const db = require("../config/db");

const checkTaxStatus = (req, res) => {
  const { reg_no } = req.params;

  const sql = `
    SELECT reg_no,
           owner_name,
           vehicle_type,
           tax_expiry_date
    FROM vehicles
    WHERE reg_no = ?
  `;

  db.query(sql, [reg_no], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.length === 0) {
      return res.status(404).json({
        message: "Vehicle Not Found",
      });
    }

    const vehicle = result[0];

    const today = new Date();
    const expiryDate = new Date(vehicle.tax_expiry_date);

    const status =
      expiryDate >= today
        ? "VALID"
        : "EXPIRED";

    res.status(200).json({
  reg_no: vehicle.reg_no,
  owner_name: vehicle.owner_name,
  vehicle_type: vehicle.vehicle_type,
  tax_expiry_date: vehicle.tax_expiry_date,
  tax_status: status,
});
  });
};

module.exports = {
  checkTaxStatus,
};