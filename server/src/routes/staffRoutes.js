import express from "express";
import Member from "../models/Member.js";
import Attendance from "../models/Attendance.js";

const router = express.Router();

const todayStr = () => new Date().toISOString().slice(0, 10);
const timeStr = () => new Date().toTimeString().slice(0, 5);

// GET /api/staff/members?query=
router.get("/members", async (req, res) => {
  try {
    const q = (req.query.query || "").trim();
    if (!q) return res.json([]);

    const members = await Member.find({
      $or: [
        { fullName: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { phone: { $regex: q, $options: "i" } },
      ],
    })
      .select("fullName email phone status expiryDate plan")
      .limit(20)
      .sort({ createdAt: -1 });

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/staff/checkin  { memberId, note? }
router.post("/checkin", async (req, res) => {
  try {
    const { memberId, note = "" } = req.body;

    if (!memberId) {
      return res.status(400).json({ message: "memberId is required" });
    }

    const member = await Member.findById(memberId).select("fullName status");
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const attendance = await Attendance.create({
      memberId,
      staffId: req.user._id,
      date: todayStr(),
      time: timeStr(),
      note,
    });

    res.status(201).json({ message: "Checked in", attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/staff/attendance/today
router.get("/attendance/today", async (req, res) => {
  try {
    const date = todayStr();

    const rows = await Attendance.find({ date })
      .populate("memberId", "fullName email phone")
      .populate("staffId", "name email")
      .sort({ createdAt: -1 });

    res.json({ date, rows });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;