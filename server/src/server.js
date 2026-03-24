import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import memberRoutes from "./routes/memberRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { requireAuth } from "./middleware/auth.js/requireAuth.js";
import { requireRole } from "./middleware/auth.js/requireRole.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import express from "express";
import Member from "./models/Member.js";
import staffRoutes from "./routes/staffRoutes.js";

const router = express.Router();

const todayStr = () => new Date().toISOString().slice(0, 10);
const timeStr = () => new Date().toTimeString().slice(0, 5);

// GET /api/staff/members?query=
router.get("/members", async (req, res) => {
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
});

// POST /api/staff/checkin  { memberId, note? }
router.post("/checkin", async (req, res) => {
  const { memberId, note = "" } = req.body;
  if (!memberId) return res.status(400).json({ message: "memberId is required" });

  // Ensure member exists
  const member = await Member.findById(memberId).select("fullName status");
  if (!member) return res.status(404).json({ message: "Member not found" });

  const attendance = await Attendance.create({
    memberId,
    staffId: req.user._id,
    date: todayStr(),
    time: timeStr(),
    note,
  });

  res.status(201).json({ message: "Checked in", attendance });
});

// GET /api/staff/attendance/today
router.get("/attendance/today", async (req, res) => {
  const date = todayStr();

  const rows = await Attendance.find({ date })
    .populate("memberId", "fullName email phone")
    .populate("staffId", "name email")
    .sort({ createdAt: -1 });

  res.json({ date, rows });
});

export default router;

dotenv.config();

const app = express();

// middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// routes
app.get("/", (req, res) => res.send("Gym API running ✅"));
app.use("/api/members", memberRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/members", requireAuth, requireRole("admin"), memberRoutes);
app.use("/api/users", requireAuth, requireRole("admin"), userRoutes);
app.use("/api/admin", requireAuth, requireRole("admin"), adminRoutes);
app.use("/api/plans", requireAuth, requireRole("admin"), planRoutes);
app.use("/api/seed", requireAuth, requireRole("admin"), seedRoutes);
app.use("/api/staff", requireAuth, requireRole("staff", "admin"), staffRoutes);


// start
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
});