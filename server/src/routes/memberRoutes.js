import express from "express";
import Member from "../models/Member.js";

const router = express.Router();

// GET /api/members?query=&status=
router.get("/", async (req, res) => {
  const { query = "", status = "All" } = req.query;

  const q = query.trim();
  const filter = {};

  if (q) {
    filter.$or = [
      { fullName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { phone: { $regex: q, $options: "i" } },
    ];
  }
  if (status !== "All") filter.status = status;

  const members = await Member.find(filter).sort({ createdAt: -1 });
  res.json(members);
});

// POST /api/members
router.post("/", async (req, res) => {
  const created = await Member.create(req.body);
  res.status(201).json(created);
});

// PUT /api/members/:id
router.put("/:id", async (req, res) => {
  const updated = await Member.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) return res.status(404).json({ message: "Member not found" });
  res.json(updated);
});

// DELETE /api/members/:id
router.delete("/:id", async (req, res) => {
  const deleted = await Member.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Member not found" });
  res.json({ message: "Deleted" });
});

export default router;