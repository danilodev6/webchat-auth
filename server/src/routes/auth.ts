import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.ts";
import { loginSchema, registerSchema } from "../schemas.ts";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "testing-secret";

// Me
router.get("/me", (req, res) => {
  if (!req.session?.user) {
    return res.status(401).json({ user: null });
  }
  res.json({ user: req.session.user });
});

// Register
router.post("/register", async (req, res) => {
  try {
    // Validate
    const { email, password } = registerSchema.parse(req.body);

    // Check if user exists
    const existing = await db.execute({
      sql: "SELECT id FROM users WHERE email = ?",
      args: [email],
    });

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.execute({
      sql: "INSERT INTO users (email, password) VALUES (?, ?) RETURNING id, email",
      args: [email, hashedPassword],
    });

    const user = result.rows[0];

    // Generate token
    const token = jwt.sign({ userId: user?.id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: { id: user?.id, email: user?.email },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // Validate
    const { email, password } = loginSchema.parse(req.body);

    // Find user
    const result = await db.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password as string);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Login failed" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Logged out successfully" });
});

export default router;
