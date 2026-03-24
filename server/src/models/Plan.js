import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    priceLKR: { type: Number, required: true, min: 0 },
    durationDays: { type: Number, required: true, min: 1 },
    description: { type: String, trim: true, default: "" },
    category: { type: String, enum: ["individual", "couple"], default: "individual" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);