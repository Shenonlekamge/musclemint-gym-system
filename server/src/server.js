// server/src/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import memberRoutes from "./routes/memberRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";

import { requireAuth } from "./middleware/auth.js/requireAuth.js";
import { requireRole } from "./middleware/auth.js/requireRole.js";

dotenv.config();

const app = express();

// ✅ Allowed origins for local dev + deployed frontend (Vercel)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // your production vercel url
].filter(Boolean);

// middleware
app.use(
  cors({
    origin: (origin, cb) => {
      // allow Postman / server-to-server
      if (!origin) return cb(null, true);

      // allow listed origins
      if (allowedOrigins.includes(origin)) return cb(null, true);

      // allow Vercel preview + prod domains
      if (origin.endsWith(".vercel.app")) return cb(null, true);

      return cb(new Error("CORS blocked: " + origin));
    },
    credentials: true,
  })
);

app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("Gym API running ✅");
});

app.use("/api/auth", authRoutes);

// admin protected routes
app.use("/api/members", requireAuth, requireRole("admin"), memberRoutes);
app.use("/api/users", requireAuth, requireRole("admin"), userRoutes);
app.use("/api/admin", requireAuth, requireRole("admin"), adminRoutes);
app.use("/api/plans", requireAuth, requireRole("admin"), planRoutes);
app.use("/api/seed", requireAuth, requireRole("admin"), seedRoutes);

// staff/admin protected routes
app.use("/api/staff", requireAuth, requireRole("staff", "admin"), staffRoutes);

// start
const PORT = process.env.PORT || 5000;

connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => {
    // ✅ Works for local + Render/Railway (not hardcoded localhost)
    console.log(`🚀 Server running on port ${PORT}`);
  });
});