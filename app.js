const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Kategreen API is running...");
});

module.exports = app;
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/wallet", walletRoutes);
app.use("/api/v1/transfer", transferRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/escrow", escrowRoutes);
app.use("/api/v1/delivery", deliveryRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/dispute", disputeRoutes);