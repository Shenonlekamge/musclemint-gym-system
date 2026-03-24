import express from "express";
import Plan from "../models/Plan.js";

const router = express.Router();

// GET /api/plans
router.get("/", async (req, res) => {
  const plans = await Plan.find().sort({ createdAt: -1 });
  res.json(plans);
});

// POST /api/plans
router.post("/", async (req, res) => {
  const created = await Plan.create(req.body);
  res.status(201).json(created);
});

// PUT /api/plans/:id
router.put("/:id", async (req, res) => {
  const updated = await Plan.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) return res.status(404).json({ message: "Plan not found" });
  res.json(updated);
});

// DELETE /api/plans/:id
router.delete("/:id", async (req, res) => {
  const deleted = await Plan.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Plan not found" });
  res.json({ message: "Deleted" });
});

export default router;