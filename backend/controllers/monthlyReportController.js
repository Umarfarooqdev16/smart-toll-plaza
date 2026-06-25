const db = require("../config/db");

const getMonthlyReport = (req, res) => {
  const sql = `
    SELECT
      MONTH(created_at) AS month,
      YEAR(created_at) AS year,
      COUNT(*) AS total_transactions,
      SUM(amount) AS total_collection
    FROM transactions
    WHERE payment_status = 'Paid'
    GROUP BY YEAR(created_at), MONTH(created_at)
    ORDER BY year DESC, month DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

module.exports = {
  getMonthlyReport,
};