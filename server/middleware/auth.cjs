// middleware/auth.js
const jwt = require("jsonwebtoken");

const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;

function supabaseAuth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  try {
    const decoded = jwt.verify(token, supabaseJwtSecret);
    // Attach Supabase user to req.user
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}

module.exports = supabaseAuth;
