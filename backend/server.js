require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Test
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send("Smart Toll Plaza Backend Running");
});

// Routes
app.use("/api/vehicles", require("./routes/vehicleRoutes"));
app.use("/api/toll", require("./routes/tollRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/excel", require("./routes/excelRoutes"));

// Transactions
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use(
  "/api/transaction-import",
  require("./routes/transactionImportRoutes")
);

// Dashboard
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/monthly-report", require("./routes/monthlyReportRoutes"));
app.use("/api/tax", require("./routes/taxRoutes"));

// Blacklist
app.use("/api/blacklist", require("./routes/blacklistRoutes"));
app.use(
  "/api/blacklist-import",
  require("./routes/blacklistImportRoutes")
);

// Authentication & AI
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});