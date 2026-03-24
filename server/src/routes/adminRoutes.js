// src/routes/adminRoutes.js
import express from "express";
import Member from "../models/Member.js";

const router = express.Router();

// GET /api/admin/overview
router.get("/overview", async (req, res) => {
  const totalMembers = await Member.countDocuments();
  const activeMembers = await Member.countDocuments({ status: "Active" });
  const frozenMembers = await Member.countDocuments({ status: "Frozen" });
  const expiredMembers = await Member.countDocuments({ status: "Expired" });

  // Expiring in next 7 days (based on expiryDate string YYYY-MM-DD)
  const today = new Date();
  const in7 = new Date();
  in7.setDate(today.getDate() + 7);

  const fmt = (d) => d.toISOString().slice(0, 10);
  const expiringSoon = await Member.countDocuments({
    status: "Active",
    expiryDate: { $gte: fmt(today), $lte: fmt(in7) },
  });

  res.json({
    totalMembers,
    activeMembers,
    frozenMembers,
    expiredMembers,
    expiringSoon,
  });
});

export default router;