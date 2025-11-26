import db from "../db.js";
import bcrypt from "bcrypt";

export const signup = async (req, res, next) => {
  const {
    name,
    username,
    password,
    role,
    designation,
    licenseNumber,
    specialization
  } = req.body;

  if (!name || !username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const sanitizedUsername = username.trim().toLowerCase();
    const sanitizedName = name.trim();
    const sanitizedRole = role.trim().toLowerCase();

    const [existing] = await db.execute(
      "SELECT id FROM Signup WHERE username = ? LIMIT 1",
      [sanitizedUsername]
    );

    if (existing.length) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      `INSERT INTO Signup (name, username, password, role, designation, licenseNumber, specialization)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitizedName,
        sanitizedUsername,
        hashed,
        sanitizedRole,
        sanitizedRole === "doctor" ? designation : null,
        sanitizedRole === "doctor" ? licenseNumber : null,
        sanitizedRole === "doctor" ? specialization : null
      ]
    );

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.error("Signup Error:", err);
    next(err);
  }
};
