const db = require("../config/db");

const updateVehicle = (req, res) => {

  console.log(req.body);

  const {
    owner_name,
    vehicle_type,
    tax_status,
    toll_category,
  } = req.body;

  const sql = `
    UPDATE vehicles
    SET owner_name=?,
        vehicle_type=?,
        tax_status=?,
        toll_category=?
    WHERE reg_no=?
  `;

  db.query(
    sql,
    [
      owner_name,
      vehicle_type,
      tax_status,
      toll_category,
      req.params.reg_no,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.status(200).json({
        message: "Vehicle Updated Successfully",
      });
    }
  );
};

module.exports = {
  updateVehicle,
};