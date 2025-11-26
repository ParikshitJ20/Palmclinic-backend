import express from "express";
import pool from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// ------------------ SIGNUP ------------------
router.post("/signup", async (req, res) => {
  const { name, username, password, role, designation, licenseNumber, specialization } = req.body;

  if (!name || !username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if username exists
    const [rows] = await pool.query(
      "SELECT username FROM Signup WHERE username = ? LIMIT 1",
      [username]
    );

    if (rows.length > 0) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // If doctor, insert extra fields
    await pool.query(
      `INSERT INTO Signup (name, username, password, role, designation, licenseNumber, specialization)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        username,
        hashedPassword,
        role,
        role === "doctor" ? designation : null,
        role === "doctor" ? licenseNumber : null,
        role === "doctor" ? specialization : null
      ]
    );

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------ LOGIN ------------------
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM Signup WHERE username = ? LIMIT 1",
      [username]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Return sanitized user
    const userData = {
      id: user.id,
      name: user.name,
      username: user.username,
      role: user.role,
      designation: user.designation,
      licenseNumber: user.licenseNumber,
      specialization: user.specialization
    };

    res.status(200).json({
      message: "Login successful",
      user: userData,
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
