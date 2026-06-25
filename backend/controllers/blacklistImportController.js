const XLSX = require("xlsx");
const db = require("../config/db");

const importBlacklist = (req, res) => {
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

    console.log("First Blacklist Record:", data[0]);

    data.forEach((vehicle) => {
      db.query(
        `
        INSERT INTO blacklisted_vehicles
        (
          reg_no,
          reason
        )
        VALUES (?, ?)
        `,
        [
          vehicle.reg_no,
          vehicle.reason,
        ],
        (err) => {
          if (err) {
            console.log("IMPORT ERROR:", err);
          }
        }
      );
    });

    res.status(200).json({
      message: "Blacklist Imported Successfully",
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
  importBlacklist,
};