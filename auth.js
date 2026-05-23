const router  = require("express").Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const db      = require("../../config/db");

const SECRET = process.env.JWT_SECRET || "setera_secret_change_me";
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "name, email and password are required." });

  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });

  try {
    
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length)
      return res.status(409).json({ error: "Email already registered." });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name.trim(), email.toLowerCase().trim(), hash]
    );

    const token = jwt.sign(
      { id: result.insertId, email: email.toLowerCase().trim(), name: name.trim() },
      SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Account created.",
      token,
      user: { id: result.insertId, name: name.trim(), email: email.toLowerCase().trim() }
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error." });
  }
});


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "email and password are required." });

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);
    if (!rows.length)
      return res.status(401).json({ error: "Invalid email or password." });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password." });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful.",
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

router.get("/me", require("../../middleware/auth").requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error: "User not found." });
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
