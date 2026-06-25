const db = require("../config/db");

const getPeakHours = (req, res) => {
  const sql = `
    SELECT
      HOUR(created_at) AS hour,
      COUNT(*) AS traffic
    FROM transactions
    GROUP BY HOUR(created_at)
    ORDER BY hour
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

module.exports = {
  getPeakHours,
};