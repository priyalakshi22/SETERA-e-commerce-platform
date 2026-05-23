require("dotenv").config();
const express = require("express");
const cors    = require("cors");
const mysql   = require("mysql2/promise");
 

const db = mysql.createPool({
  host:     process.env.DB_HOST || "localhost",
  user:     process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "setera_db",
  waitForConnections: true,
  connectionLimit: 10,
});
 
const app = express();
 

app.use(cors({ origin: "*", methods: ["GET","POST","PUT","DELETE","OPTIONS"], allowedHeaders: ["Content-Type","Authorization"] }));
app.use(express.json());
 

const jwt    = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "setera_secret_change_me";
 
function requireAuth(req, res, next) {
  const header = req.headers["authorization"] || "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token provided." });
  try { req.user = jwt.verify(token, SECRET); next(); }
  catch { res.status(401).json({ error: "Invalid or expired token." }); }
}
 
function optionalAuth(req, res, next) {
  const header = req.headers["authorization"] || "";
  const token  = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (token) { try { req.user = jwt.verify(token, SECRET); } catch {} }
  next();
}
 

const bcrypt      = require("bcryptjs");
const authRouter  = require("express").Router();
 

authRouter.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: "name, email and password are required." });
  if (password.length < 6)
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  try {
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (rows.length) return res.status(409).json({ error: "Email already registered." });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name.trim(), email.toLowerCase().trim(), hash]
    );
    const token = jwt.sign({ id: result.insertId, email: email.toLowerCase().trim(), name: name.trim() }, SECRET, { expiresIn: "7d" });
    res.status(201).json({ message: "Account created.", token, user: { id: result.insertId, name: name.trim(), email: email.toLowerCase().trim() } });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});
 

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password are required." });
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email.toLowerCase().trim()]);
    if (!rows.length) return res.status(401).json({ error: "Invalid email or password." });
    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid email or password." });
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, SECRET, { expiresIn: "7d" });
    res.json({ message: "Login successful.", token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});
 

authRouter.get("/me", requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [req.user.id]);
    if (!rows.length) return res.status(404).json({ error: "User not found." });
    res.json({ user: rows[0] });
  } catch (err) { res.status(500).json({ error: "Server error." }); }
});
 
app.use("/api/auth", authRouter);
 
const ordersRouter = require("express").Router();
 
function calcTotals(lines) {
  const PROMO_RATE    = 0.10;
  const DELIVERY_FLAT = 450;
  const FREE_SHIP_MIN = 25000;
  let subtotal = 0;
  for (const l of lines) {
    const unitPrice = l.category === "electronics" ? Math.round(l.price * 0.75) : l.price;
    l._unitPrice = unitPrice;
    subtotal += unitPrice * l.quantity;
  }
  const promoDeduction = subtotal > 0 ? Math.round(subtotal * PROMO_RATE) : 0;
  const deliveryFee    = subtotal >= FREE_SHIP_MIN || subtotal === 0 ? 0 : DELIVERY_FLAT;
  const grandTotal     = subtotal - promoDeduction + deliveryFee;
  return { subtotal, promoDeduction, deliveryFee, grandTotal };
}
 

ordersRouter.post("/", optionalAuth, async (req, res) => {
  const { email, firstName, lastName, address, city, phone, cart } = req.body;
  if (!email || !firstName || !lastName || !address || !city || !phone)
    return res.status(400).json({ error: "All delivery fields are required." });
  if (!Array.isArray(cart) || !cart.length)
    return res.status(400).json({ error: "Cart is empty." });
 
  const { subtotal, promoDeduction, deliveryFee, grandTotal } = calcTotals(cart);
  const orderRef = "ORD-" + Date.now();
  const userId   = req.user ? req.user.id : null;
  const conn     = await db.getConnection();
  try {
    await conn.beginTransaction();
    const [orderResult] = await conn.query(
      `INSERT INTO orders (order_ref, user_id, email, first_name, last_name, address, city, phone, subtotal, promo_deduction, delivery_fee, grand_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderRef, userId, email.toLowerCase().trim(), firstName.trim(), lastName.trim(),
       address.trim(), city.trim(), phone.trim(), subtotal, promoDeduction, deliveryFee, grandTotal]
    );
    const orderId = orderResult.insertId;
    for (const item of cart) {
      await conn.query(
        `INSERT INTO order_lines (order_id, product_id, name, category, unit_price, quantity, line_total) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.name, item.category, item._unitPrice, item.quantity, item._unitPrice * item.quantity]
      );
    }
    await conn.commit();
    res.status(201).json({ message: "Order placed successfully.", orderRef, grandTotal, deliveryFee, promoDeduction, subtotal });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to place order." });
  } finally { conn.release(); }
});
 

ordersRouter.get("/my", requireAuth, async (req, res) => {
  try {
    const [orders] = await db.query(
      "SELECT id, order_ref, email, first_name, last_name, city, grand_total, status, placed_at FROM orders WHERE user_id = ? ORDER BY placed_at DESC",
      [req.user.id]
    );
    for (const order of orders) {
      const [lines] = await db.query(
        "SELECT product_id, name, category, unit_price, quantity, line_total FROM order_lines WHERE order_id = ?",
        [order.id]
      );
      order.lines = lines;
    }
    res.json({ orders });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});
 

ordersRouter.get("/:ref", optionalAuth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM orders WHERE order_ref = ?", [req.params.ref]);
    if (!rows.length) return res.status(404).json({ error: "Order not found." });
    const order = rows[0];
    if (order.user_id && req.user && order.user_id !== req.user.id)
      return res.status(403).json({ error: "Forbidden." });
    const [lines] = await db.query(
      "SELECT product_id, name, category, unit_price, quantity, line_total FROM order_lines WHERE order_id = ?",
      [order.id]
    );
    order.lines = lines;
    res.json({ order });
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error." }); }
});
 
app.use("/api/orders", ordersRouter);
 

app.get("/api/health", (_, res) => res.json({ status: "ok", time: new Date() }));
app.use((_, res) => res.status(404).json({ error: "Route not found." }));
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: "Internal server error." }); });
 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`SETERA backend running on http://localhost:${PORT}`));