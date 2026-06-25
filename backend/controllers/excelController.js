const XLSX = require("xlsx");
const db = require("../config/db");

const importExcel = (req, res) => {
  console.log("REQ.FILE =", req.file);

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

    console.log("First Row:", data[0]);

    data.forEach((vehicle) => {
      const sql = `
        INSERT INTO vehicles
        (reg_no, owner_name, vehicle_type, tax_status, toll_category)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [
          vehicle.reg_no,
          vehicle.owner_name,
          vehicle.vehicle_type,
          vehicle.tax_status,
          vehicle.toll_category,
        ],
        (err) => {
          if (err) {
            console.log("INSERT ERROR:", err.message);
          }
        }
      );
    });

    res.status(200).json({
      message: "Excel Imported Successfully",
      records: data.length,
    });
  } catch (error) {
    console.log("ERROR =", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  importExcel,
};