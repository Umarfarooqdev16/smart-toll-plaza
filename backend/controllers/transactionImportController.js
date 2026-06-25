const XLSX = require("xlsx");
const db = require("../config/db");

const importTransactions = (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file uploaded",
    });
  }

  try {
    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    const data = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    console.log("First Transaction:", data[0]);

    data.forEach((txn) => {
      db.query(
        `
        INSERT INTO transactions
        (
          reg_no,
          vehicle_type,
          amount,
          payment_status,
          created_at
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          txn.reg_no,
          txn.vehicle_type,
          txn.amount,
          txn.payment_status,
          txn.created_at,
        ],
        (err) => {
          if (err) {
            console.log("IMPORT ERROR:", err);
          }
        }
      );
    });

    res.status(200).json({
      message: "Transactions Imported Successfully",
      records: data.length,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  importTransactions,
};