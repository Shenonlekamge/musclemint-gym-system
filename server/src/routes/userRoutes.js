// src/routes/userRoutes.js
import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// GET /api/users/staff  (list staff)
router.get("/staff", async (req, res) => {
  const staff = await User.find({ role: "staff" })
    .select("-passwordHash")
    .sort({ createdAt: -1 });
  res.json(staff);
});

// POST /api/users/staff  (create staff)
router.post("/staff", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "name, email, password are required" });

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "staff",
  });

  res.status(201).json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  });
});

// DELETE /api/users/:id (delete staff)
router.delete("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.role !== "staff")
    return res.status(400).json({ message: "Only staff users can be deleted here" });

  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;