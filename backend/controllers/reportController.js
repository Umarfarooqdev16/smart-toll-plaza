const db = require("../config/db");

// Daily Report
const getDailyReport = (req, res) => {
  const sql = `
    SELECT
      COUNT(*) AS total_transactions,
      COALESCE(SUM(amount),0) AS total_collection
    FROM transactions
    WHERE DATE(created_at) = CURDATE()
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result[0]);
  });
};

// Summary Report
const getSummaryReport = async (req, res) => {
  try {
    const [vehicles] = await db.promise().query(
      "SELECT COUNT(*) AS totalVehicles FROM vehicles"
    );

    const [transactions] = await db.promise().query(
      "SELECT COUNT(*) AS totalTransactions FROM transactions"
    );

    const [revenue] = await db.promise().query(
      "SELECT COALESCE(SUM(amount),0) AS totalRevenue FROM transactions WHERE payment_status='Paid'"
    );

    const [blacklisted] = await db.promise().query(
      "SELECT COUNT(*) AS totalBlacklisted FROM blacklisted_vehicles"
    );

    res.status(200).json({
      totalVehicles: vehicles[0].totalVehicles,
      totalTransactions: transactions[0].totalTransactions,
      totalRevenue: revenue[0].totalRevenue,
      totalBlacklisted: blacklisted[0].totalBlacklisted,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getDailyReport,
  getSummaryReport,
};