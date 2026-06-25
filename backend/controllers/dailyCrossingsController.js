const db = require("../config/db");

const getDailyCrossings = (req, res) => {
  const sql = `
    SELECT
      DATE(created_at) AS day,
      COUNT(*) AS crossings
    FROM transactions
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) DESC
    LIMIT 7
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

module.exports = {
  getDailyCrossings,
};