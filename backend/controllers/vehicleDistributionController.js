const db = require("../config/db");

const getVehicleDistribution = (req, res) => {
  const sql = `
    SELECT
      vehicle_type,
      COUNT(*) AS total
    FROM vehicles
    GROUP BY vehicle_type
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

module.exports = {
  getVehicleDistribution,
};