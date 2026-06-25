const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: "TLSv1.2",
  },
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection Failed");
    console.error(err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

module.exports = db;