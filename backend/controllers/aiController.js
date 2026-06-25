const db = require("../config/db");

const getAIInsights = async (req, res) => {
  try {
    const insights = {};

    db.query(
      "SELECT COUNT(*) AS totalVehicles FROM vehicles",
      (err, vehicles) => {
        if (err) return res.status(500).json(err);

        insights.totalVehicles =
          vehicles[0].totalVehicles;

        db.query(
          "SELECT COUNT(*) AS totalTransactions, COALESCE(SUM(amount),0) AS totalRevenue FROM transactions WHERE payment_status='Paid'",
          (err, transactions) => {
            if (err) return res.status(500).json(err);

            insights.totalTransactions =
              transactions[0].totalTransactions;

            insights.totalRevenue =
              transactions[0].totalRevenue;

            db.query(
              "SELECT COUNT(*) AS blacklisted FROM blacklisted_vehicles",
              (err, blacklist) => {
                if (err) return res.status(500).json(err);

                insights.blacklisted =
                  blacklist[0].blacklisted;

                db.query(
                  `
                  SELECT vehicle_type,
                         COUNT(*) AS total
                  FROM vehicles
                  GROUP BY vehicle_type
                  ORDER BY total DESC
                  LIMIT 1
                  `,
                  (err, vehicleType) => {
                    if (err)
                      return res.status(500).json(err);

                    insights.mostCommonVehicle =
                      vehicleType.length
                        ? vehicleType[0].vehicle_type
                        : "N/A";

                    insights.avgRevenue =
                      insights.totalTransactions > 0
                        ? (
                            insights.totalRevenue /
                            insights.totalTransactions
                          ).toFixed(2)
                        : 0;

                    db.query(
                      "SELECT COUNT(*) AS expiredTax FROM vehicles WHERE tax_status='Expired'",
                      (err, expiredTaxResult) => {
                        if (err) return res.status(500).json(err);

                        insights.expiredTax =
                          expiredTaxResult[0].expiredTax;

                        res.status(200).json(insights);
                      }
                    );
                  }
                );
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  getAIInsights,
};