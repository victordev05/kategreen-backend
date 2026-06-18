const transferRoutes = require("./routes/transfer.routes");

app.use("/api/transfer", transferRoutes);
const escrowRoutes = require("./routes/escrow.routes");

app.use("/api/escrow", escrowRoutes);
const adminRoutes = require("./routes/admin.routes");

app.use("/api/admin", adminRoutes);
const disputeRoutes = require("./routes/dispute.routes");

app.use("/api/dispute", disputeRoutes);
const limiter = require("./middleware/rateLimit.middleware");

app.use(limiter);
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const app = express();

app.use(cors());
app.use(helmet()); // security headers
app.use(compression()); // speed optimization
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Kategreen API Running 🚀");
});

module.exports = app;