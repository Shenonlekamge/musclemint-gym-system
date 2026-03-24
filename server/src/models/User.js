import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    email: { type: String, trim: true, lowercase: true, unique: true, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "staff", "member"], required: true },
    // optional link to member doc if role == member
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member", default: null },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);