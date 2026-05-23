const router = require("express").Router();
const db     = require("../../config/db");
const { optionalAuth, requireAuth } = require("../../middleware/auth");

function calcTotals(lines) {
  const ELECTRONICS_DISCOUNT = 0.25;
  const PROMO_RATE            = 0.10;
  const DELIVERY_FLAT         = 450;
  const FREE_SHIP_MIN         = 25000;

  let subtotal = 0;
  for (const l of lines) {
    const unitPrice = l.category === "electronics"
      ? Math.round(l.price * (1 - ELECTRONICS_DISCOUNT))
      : l.price;
    l._unitPrice = unitPrice;
    subtotal += unitPrice * l.quantity;
  }

  const promoDeduction = subtotal > 0 ? Math.round(subtotal * PROMO_RATE) : 0;
  const deliveryFee    = subtotal >= FREE_SHIP_MIN || subtotal === 0 ? 0 : DELIVERY_FLAT;
  const grandTotal     = subtotal - promoDeduction + deliveryFee;

  return { subtotal, promoDeduction, deliveryFee, grandTotal };
}

router.post("/", optionalAuth, async (req, res) => {
  const { email, firstName, lastName, address, city, phone, cart } = req.body;
  if (!email || !firstName || !lastName || !address || !city || !phone)
    return res.status(400).json({ error: "All delivery fields are required." });

  if (!Array.isArray(cart) || !cart.length)
    return res.status(400).json({ error: "Cart is empty." });

  for (const item of cart) {
    if (!item.productId || !item.name || !item.category || !item.price || !item.quantity)
      return res.status(400).json({ error: "Each cart item needs productId, name, category, price, quantity." });
  }

  const { subtotal, promoDeduction, deliveryFee, grandTotal } = calcTotals(cart);
  const orderRef = "ORD-" + Date.now();
  const userId   = req.user ? req.user.id : null;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      `INSERT INTO orders
         (order_ref, user_id, email, first_name, last_name, address, city, phone,
          subtotal, promo_deduction, delivery_fee, grand_total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [orderRef, userId,
       email.toLowerCase().trim(), firstName.trim(), lastName.trim(),
       address.trim(), city.trim(), phone.trim(),
       subtotal, promoDeduction, deliveryFee, grandTotal]
    );

    const orderId = orderResult.insertId;

    for (const item of cart) {
      const lineTotal = item._unitPrice * item.quantity;
      await conn.query(
        `INSERT INTO order_lines
           (order_id, product_id, name, category, unit_price, quantity, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.name, item.category,
         item._unitPrice, item.quantity, lineTotal]
      );
    }

    await conn.commit();

    res.status(201).json({
      message: "Order placed successfully.",
      orderRef,
      grandTotal,
      deliveryFee,
      promoDeduction,
      subtotal
    });
  } catch (err) {
    await conn.rollback();
    console.error("Place order error:", err);
    res.status(500).json({ error: "Failed to place order." });
  } finally {
    conn.release();
  }
});
router.get("/my", requireAuth, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT id, order_ref, email, first_name, last_name, city,
              grand_total, status, placed_at
       FROM orders WHERE user_id = ?
       ORDER BY placed_at DESC`,
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
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ error: "Server error." });
  }
});
router.get("/:ref", optionalAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM orders WHERE order_ref = ?",
      [req.params.ref]
    );
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
  } catch (err) {
    console.error("Get order error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
