import jwt from "jsonwebtoken";
import User from "../../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const hdr = req.headers.authorization || "";
    const token = hdr.startsWith("Bearer ") ? hdr.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Missing token" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select("-passwordHash");
    if (!user) return res.status(401).json({ message: "Invalid token user" });

    req.user = user; // {id, role, ...}
    next();
  } catch {
    return res.status(401).json({ message: "Invalid/expired token" });
  }
}