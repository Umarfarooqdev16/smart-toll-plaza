const db = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const [vehicles] = await db.promise().query(
      "SELECT COUNT(*) AS totalVehicles FROM vehicles"
    );

    const [transactions] = await db.promise().query(
      "SELECT COUNT(*) AS totalTransactions FROM transactions WHERE payment_status='Paid'"
    );

    const [collection] = await db.promise().query(
      "SELECT IFNULL(SUM(amount),0) AS totalCollection FROM transactions WHERE payment_status='Paid'"
    );

    const [blacklisted] = await db.promise().query(
      "SELECT COUNT(*) AS totalBlacklisted FROM blacklisted_vehicles"
    );

    res.status(200).json({
      totalVehicles: vehicles[0].totalVehicles,
      totalTransactions: transactions[0].totalTransactions,
      totalCollection: collection[0].totalCollection,
      totalBlacklisted: blacklisted[0].totalBlacklisted,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};