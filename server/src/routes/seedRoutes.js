import express from "express";
import Plan from "../models/Plan.js";

const router = express.Router();

// POST /api/seed/plans  (admin only)
router.post("/plans", async (req, res) => {
  const defaults = [
    { name: "Monthly", durationDays: 30, category: "individual", priceLKR: 0, description: "" },
    { name: "3 Months", durationDays: 90, category: "individual", priceLKR: 0, description: "" },
    { name: "Annual", durationDays: 365, category: "individual", priceLKR: 0, description: "" },
    { name: "Couple Monthly", durationDays: 30, category: "couple", priceLKR: 0, description: "" },
    { name: "Couple Annual", durationDays: 365, category: "couple", priceLKR: 0, description: "" },
  ];

  // upsert by name
  const ops = defaults.map((p) => ({
    updateOne: {
      filter: { name: p.name },
      update: { $setOnInsert: p },
      upsert: true,
    },
  }));

  const result = await Plan.bulkWrite(ops);
  res.json({ message: "Plans seeded", result });
});

export default router;