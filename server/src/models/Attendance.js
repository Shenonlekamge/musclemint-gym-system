import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", required: true },
    staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    time: { type: String, required: true }, // "HH:MM"
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

// Prevent duplicate check-in for same member on same day
attendanceSchema.index({ memberId: 1, date: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);