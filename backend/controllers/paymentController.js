const db = require("../config/db");

const makePayment = (req, res) => {
  console.log(req.body);

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
    [reg_no, vehicle_type, amount, payment_status],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Payment Recorded Successfully",
      });
    }
  );
};

module.exports = {
  makePayment,
};