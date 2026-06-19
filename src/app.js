const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

// routes
const authRoutes = require("./routes/auth.routes");
const walletRoutes = require("./routes/wallet.routes");
const transferRoutes = require("./routes/transfer.routes");
const escrowRoutes = require("./routes/escrow.routes");
const orderRoutes = require("./routes/order.routes");
const disputeRoutes = require("./routes/dispute.routes");
const adminRoutes = require("./routes/admin.routes");

// middleware
const rateLimit = require("express-rate-limit");

const app = express();

// ================= SECURITY MIDDLEWARE =================
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));

// ================= RATE LIMIT =================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later.",
});

app.use(limiter);

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/transfer", transferRoutes);
app.use("/api/escrow", escrowRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dispute", disputeRoutes);
app.use("/api/admin", adminRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("Kategreen API Running 🚀");
});

module.exports = app;