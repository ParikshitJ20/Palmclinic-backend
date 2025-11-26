import dotenv from "dotenv";
dotenv.config(); // MUST RUN FIRST!! DO NOT MOVE THIS DOWN

import express from "express";
import cors from "cors";
import "./db.js"; // Ensure DB pool initializes on bootstrap
import authRoutes from "./routes/authRoutes.js";

const app = express(); // <-- must create app first
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.use("/api/auth", authRoutes); // <-- after app is defined

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res
    .status(err?.status || 500)
    .json({ message: err?.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
