const db = require("../config/db");

const calculateToll = (req, res) => {
  const { reg_no } = req.params;

  const vehicleSql =
    "SELECT * FROM vehicles WHERE reg_no = ?";

  db.query(vehicleSql, [reg_no], (err, vehicleResult) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (vehicleResult.length === 0) {
      return res.status(404).json({
        message: "Vehicle Not Found",
      });
    }

    const vehicle = vehicleResult[0];

    const tollSql =
      "SELECT * FROM toll_rates WHERE vehicle_type = ?";

    db.query(
      tollSql,
      [vehicle.vehicle_type],
      (err, tollResult) => {
        if (err) {
          return res.status(500).json(err);
        }

        if (tollResult.length === 0) {
          return res.status(404).json({
            message: "Toll Rate Not Found",
          });
        }

        res.status(200).json({
          reg_no: vehicle.reg_no,
          owner_name: vehicle.owner_name,
          vehicle_type: vehicle.vehicle_type,
          toll_category: vehicle.toll_category,
          tax_status: vehicle.tax_status,
          amount: tollResult[0].amount,
        });
      }
    );
  });
};

module.exports = {
  calculateToll,
};