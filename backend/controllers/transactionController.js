const db = require("../config/db");

const getTransactions = (req, res) => {
  const sql = `
    SELECT *
    FROM transactions
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

const createTransaction = (req, res) => {
  const {
    reg_no,
    vehicle_type,
    amount,
    payment_status,
  } = req.body;

  const sql = `
    INSERT INTO transactions
    (reg_no, vehicle_type, amount, payment_status)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      reg_no,
      vehicle_type,
      amount,
      payment_status,
    ],
    (err) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Transaction Created Successfully",
      });
    }
  );
};

module.exports = {
  getTransactions,
  createTransaction,
};