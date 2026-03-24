import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, trim: true },
    plan: { type: String, enum: ["Monthly", "Quarterly", "Annual"], default: "Monthly" },
    status: { type: String, enum: ["Active", "Frozen", "Expired"], default: "Active" },
    expiryDate: { type: String, required: true }, // keeping as string "YYYY-MM-DD" for simplicity
  },
  { timestamps: true }
);

export default mongoose.model("Member", memberSchema);