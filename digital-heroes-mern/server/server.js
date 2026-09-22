require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

// ===============================
// Environment Configuration
// ===============================

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// ===============================
// Middleware
// ===============================

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// Health Check
// ===============================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Digital Heroes API is running",
  });
});

// ===============================
// Routes
// ===============================

app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/users", require("./routes/userRoutes"));

app.use("/api/scores", require("./routes/scoreRoutes"));

app.use("/api/subscriptions", require("./routes/subscriptionRoutes"));

app.use("/api/charities", require("./routes/charityRoutes"));

app.use("/api/draws", require("./routes/drawRoutes"));

app.use("/api/winners", require("./routes/winnerRoutes"));

app.use("/api/admin", require("./routes/adminRoutes"));

app.use("/api/payments", require("./routes/paymentRoutes"));

// ===============================
// Error Handling
// ===============================

app.use(notFound);

app.use(errorHandler);

// ===============================
// Start Server
// ===============================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("Backend Is Running now ----->");
      console.log(`Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
