(function () {
  "use strict";

  var API_BASE = "http://localhost:3001/api";

  function apiPost(path, body, token) {
    var headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = "Bearer " + token;
    return fetch(API_BASE + path, { method: "POST", headers: headers, body: JSON.stringify(body) })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, status: r.status, data: d }; }); });
  }

  function apiGet(path, token) {
    var headers = {};
    if (token) headers["Authorization"] = "Bearer " + token;
    return fetch(API_BASE + path, { method: "GET", headers: headers })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, status: r.status, data: d }; }); });
  }


  var STORAGE_USER = "setera_user";
  var STORAGE_CART = "setera_cart";
  var STORAGE_INVENTORY = "setera_inventory";
  var STORAGE_ORDERS = "setera_orders";
  var STORAGE_MESSAGES = "setera_contact_messages";

  var CATEGORIES = [
    { id: "all", label: "All" },
    { id: "electronics", label: "Electronics" },
    { id: "home-collections", label: "Home collections" },
    { id: "baby-dresses", label: "Baby collection" },
    { id: "fashion", label: "Fashion collection" },
    { id: "foods", label: "Foods" },
    { id: "makeup", label: "Cosmetic collection" },
    { id: "bags", label: "Bag collection" }
  ];

  var PRODUCTS = [
    { id: "p-electronics", name: "Wireless Headset", category: "electronics", categoryLabel: "Electronics", price: 7999, image: "headset_2.jpeg" },
    { id: "p-elec-macbook-pro", name: "Apple MacBook Pro", category: "electronics", categoryLabel: "Electronics", price: 5650000, image: "electronic_1.jpeg" },
    { id: "p-elec-jbl-live", name: "JBL Wireless Headphones", category: "electronics", categoryLabel: "Electronics", price: 45999, image: "headset.jpeg" },
    { id: "p-elec-ring-light", name: "Professional LED Ring Light with Tripod", category: "electronics", categoryLabel: "Electronics", price: 8500, stock: 22, image: "light_ring.jpeg" },
    { id: "p-elec-ipad-pro", name: "Apple iPad Pro (Silver)", category: "electronics", categoryLabel: "Electronics", price: 498000, image: "notepad.jpeg" },
    { id: "p-elec-apple-pencil-2", name: "Apple Pencil (2nd Generation)", category: "electronics", categoryLabel: "Electronics", price: 95999, image: "ipen.jpeg" },
    { id: "p-elec-power-bank-digital", name: "High-Capacity Digital Display Power Bank", category: "electronics", categoryLabel: "Electronics", price: 14999, image: "power_bank.jpeg" },
    { id: "p-elec-lavalier-dual", name: "Dual Wireless Lavalier Mic System (USB-C)", category: "electronics", categoryLabel: "Electronics", price: 34999, image: "mic.jpeg" },
    { id: "p-elec-handheld-fan", name: "Minimalist Handheld Rechargeable Fan", category: "electronics", categoryLabel: "Electronics", price: 5999, image: "portable_fan.jpeg" },
    { id: "p-elec-iniu-cable-240w", name: "INIU 240W USB-C Fast Charge Cable — 2-Pack", category: "electronics", categoryLabel: "Electronics", price: 7999, image: "cables.jpeg" },
    { id: "p-elec-galaxy-s25-ultra", name: "Samsung Galaxy S25 Ultra", category: "electronics", categoryLabel: "Electronics", price: 398000, image: "samsung.jpeg" },
    { id: "p-elec-dji-pocket-3", name: "DJI Osmo Pocket 3 Creator Combo", category: "electronics", categoryLabel: "Electronics", price: 329000, image: "tripod.jpeg" },
    { id: "p-home-egg-chair", name: "Swing Chair with Stand", category: "home-collections", categoryLabel: "Home collections", price: 45999, image: "chair2.jpeg" },
    { id: "p-home-fluted-glass", name: "Vertical Ribbed Glass Tumblers — Pair", category: "home-collections", categoryLabel: "Home collections", price: 2899, image: "glasses.jpeg" },
    { id: "p-home-floral-lamp", name: "Spiral Stem Blossom Desk Lamp", category: "home-collections", categoryLabel: "Home collections", price: 12499, image: "ornament.jpeg" },
    { id: "p-home-aroma-candles", name: "Artisan Aroma Candle Duo", category: "home-collections", categoryLabel: "Home collections", price: 6799, image: "candles.jpeg" },
    { id: "p-home-glass-drinkware", name: "Crystal Drinkware Starter Set", category: "home-collections", categoryLabel: "Home collections", price: 14999, image: "cups.jpeg" },
    { id: "p-home-tree-table", name: "Bloom Sculptural Side Table", category: "home-collections", categoryLabel: "Home collections", price: 185000, image: "orna.jpeg" },
    { id: "p-home-console-ornament", name: "Elevated Centrepiece", category: "home-collections", categoryLabel: "Home collections", price: 9899, image: "table.jpeg" },
    { id: "p-home-tea-service", name: "Glass Teapot Warmer & Six Cup Service", category: "home-collections", categoryLabel: "Home collections", price: 8950, image: "tea set.jpeg" },
    { id: "p-home-ribbed-tumblers", name: "Ribbed Highball Glass Pair", category: "home-collections", categoryLabel: "Home collections", price: 3199, image: "glass_1.jpeg" },
    { id: "p-home-footed-bowls", name: "Footed Glass Dessert Bowl Set — Four", category: "home-collections", categoryLabel: "Home collections", price: 5499, image: "salad cups.jpeg" },
    { id: "p-home-sakura-tray", name: "Sakura Glass Bowl Trio & Tray", category: "home-collections", categoryLabel: "Home collections", price: 7299, image: "glass_2.jpeg" },
    { id: "p-home-bamboo-rack", name: "Bamboo & Glass Kitchen Organizer Rack", category: "home-collections", categoryLabel: "Home collections", price: 11299, stock: 8, image: "rack_1.jpeg" },
    { id: "p-home-wine-rack", name: "Wave Carved Wooden Wine Rack — 6 Bottle", category: "home-collections", categoryLabel: "Home collections", price: 8699, image: "rack.jpeg" },
    { id: "p-home-crystal-glass", name: "Premium Cut Crystal Glassware Duo", category: "home-collections", categoryLabel: "Home collections", price: 4299, image: "glasses.jpeg" },
    { id: "p-home-resin-serve", name: "Gold Rim Resin Serveware Capsule", category: "home-collections", categoryLabel: "Home collections", price: 24899, stock: 7, image: "glass_set.jpeg" },
    { id: "p-home-garment-rack", name: "Open Frame Pine Garment Rack", category: "home-collections", categoryLabel: "Home collections", price: 15999, image: "rack_3.jpeg" },
    { id: "p-home-tree-shelf", name: "Dark Tree Branch Bookshelf", category: "home-collections", categoryLabel: "Home collections", price: 34999, image: "rack_5.jpeg" },
    { id: "p-home-wood-dinner", name: "Dark Grain Wooden Dinner Plate Set", category: "home-collections", categoryLabel: "Home collections", price: 6599, image: "set.jpeg" },
    { id: "p-home-magazine-rack", name: "Curved Walnut Magazine Stand", category: "home-collections", categoryLabel: "Home collections", price: 7499, image: "rack_4.jpeg" },
    { id: "p-home-tier-table", name: "Warm Wood Three-Tier Side Table", category: "home-collections", categoryLabel: "Home collections", price: 22999, image: "table.jpeg" },
    { id: "p-home-monstera-table", name: "Monstera Leaf Carved Coffee Table", category: "home-collections", categoryLabel: "Home collections", price: 67999, image: "teapow.jpeg" },
    { id: "p-baby", name: "Occasion Baby Frock — Pearl Trim", category: "baby-dresses", categoryLabel: "Baby collection", price: 3899, image: "frock.jpeg" },
    { id: "p-baby-daisy-set", name: "Daisy Print Sun Dress & Straw Hat Set", category: "baby-dresses", categoryLabel: "Baby collection", price: 4299, image: "baby2.jpeg" },
    { id: "p-baby-rail-edit", name: "Rustic Rail Dress Edit — Five Styles", category: "baby-dresses", categoryLabel: "Baby collection", price: 9299, image: "baby3.jpeg" },
    { id: "p-baby-bodysuits", name: "Earth Tone Long-Sleeve Bodysuit Pack", category: "baby-dresses", categoryLabel: "Baby collection", price: 6899, image: "baby1.jpeg" },
    { id: "p-fashion-boots", name: "Classic Leather Chelsea Boots", category: "fashion", categoryLabel: "Fashion collection", price: 22500, image: "shoe1.jpeg" },
    { id: "p-fashion-bracelet", name: "Crystal Charm Bracelet", category: "fashion", categoryLabel: "Fashion collection", price: 2899, image: "bracelet.jpeg" },
    { id: "p-fashion-cap", name: "Structured Baseball Cap", category: "fashion", categoryLabel: "Fashion collection", price: 3490, image: "cap_1.jpeg" },
    { id: "p-fashion-denim", name: "Indigo Straight-Leg Denim", category: "fashion", categoryLabel: "Fashion collection", price: 15200, image: "denim.jpeg" },
    { id: "p-fashion-coat", name: "Tailored Wool-Blend Coat", category: "fashion", categoryLabel: "Fashion collection", price: 28999, image: "full_coat.jpeg" },
    { id: "p-fashion-hairband", name: "Padded Velvet Hairband", category: "fashion", categoryLabel: "Fashion collection", price: 1799, image: "hairband.jpeg" },
    { id: "p-fashion-sandals", name: "Minimal Strappy Sandals", category: "fashion", categoryLabel: "Fashion collection", price: 5250, stock: 11, image: "heels.jpeg" },
    { id: "p-fashion-socks", name: "Cushioned Crew Socks — Pack", category: "fashion", categoryLabel: "Fashion collection", price: 2499, image: "shocks_1.jpeg" },
    { id: "p-fashion-necklaces", name: "Layered Chain Necklace Set", category: "fashion", categoryLabel: "Fashion collection", price: 6599, image: "chain.jpeg" },
    { id: "p-fashion-hair-clips", name: "Acrylic Hair Clip Quartet", category: "fashion", categoryLabel: "Fashion collection", price: 1599, image: "hair clips.jpeg" },
    { id: "p-fashion-jacket", name: "Quilted Puffer Jacket", category: "fashion", categoryLabel: "Fashion collection", price: 19800, image: "jacket.jpeg" },
    { id: "p-fashion-converse-lift", name: "Converse Chuck Taylor All Star Lift High Top", category: "fashion", categoryLabel: "Fashion collection", price: 24500, image: "shoe_2.jpeg" },
    { id: "p-fashion-white-hightops", name: "White Zip Platform High-Tops", category: "fashion", categoryLabel: "Fashion collection", price: 22999, image: "shoe_4.jpeg" },
    { id: "p-fashion-beige-clogs", name: "Beige Chunky Platform Clogs — Charm Edit", category: "fashion", categoryLabel: "Fashion collection", price: 11890, image: "shoe_5.jpeg" },
    { id: "p-fashion-chunky-sneakers", name: "Chunky Monochrome Platform Sneakers", category: "fashion", categoryLabel: "Fashion collection", price: 21999, image: "shoe_3.jpeg" },
    { id: "p-fashion-white-clogs", name: "White Platform Clogs — Monochrome Charms", category: "fashion", categoryLabel: "Fashion collection", price: 12290, image: "shoe_1.jpeg" },
    { id: "p-fashion-pleated-skirt", name: "Black Pleated Tennis Skirt", category: "fashion", categoryLabel: "Fashion collection", price: 8490, image: "skirt.jpeg" },
    { id: "p-fashion-mini-skirt", name: "Black Mini Skirt with Side Slit", category: "fashion", categoryLabel: "Fashion collection", price: 7490, image: "skirt_1.jpeg" },
    { id: "p-fashion-alo-olive", name: "Alo Yoga 3-Piece Tracksuit — Olive & White", category: "fashion", categoryLabel: "Fashion collection", price: 54999, image: "kit_2.jpeg" },
    { id: "p-fashion-alo-mono", name: "Alo Yoga 3-Piece Tracksuit — Black & White", category: "fashion", categoryLabel: "Fashion collection", price: 54999, image: "kit_1.jpeg" },
    { id: "p-fashion-coolane-tee", name: "Coolane Racing Piping T-Shirt", category: "fashion", categoryLabel: "Fashion collection", price: 6290, image: "t-shirt.jpeg" },
    { id: "p-fashion-scarf", name: "Ivory Soft-Knit Fringed Scarf", category: "fashion", categoryLabel: "Fashion collection", price: 4599, image: "showl.jpeg" },
    { id: "p-fashion-jewel-sunnies", name: "Rimless Jewel Gradient Sunglasses", category: "fashion", categoryLabel: "Fashion collection", price: 6890, image: "sunglass_1.jpeg" },
    { id: "p-fashion-smartwatch", name: "Crystal-Link Smartwatch — Beauty Dial", category: "fashion", categoryLabel: "Fashion collection", price: 89500, image: "watch_1.jpeg" },
    { id: "p-fashion-retro-sunnies", name: "Retro Rectangular Sunglasses — Duo Pack", category: "fashion", categoryLabel: "Fashion collection", price: 7490, image: "spects.jpeg" },
    { id: "p-fashion-square-glasses", name: "Oversized Square Blue-Light Glasses — Trio", category: "fashion", categoryLabel: "Fashion collection", price: 8990, image: "spects_2.jpeg" },
    { id: "p-food-nutella", name: "Nutella Hazelnut Spread — Jar", category: "foods", categoryLabel: "Foods", price: 2890, image: "food_7.jpeg" },
    { id: "p-food-lays-classic", name: "Lay's Classic Potato Chips", category: "foods", categoryLabel: "Foods", price: 520, image: "food_4.jpeg" },
    { id: "p-food-pocky-six", name: "Glico Pocky — Six Flavour Discovery Set (70g × 6)", category: "foods", categoryLabel: "Foods", price: 5490, image: "food_1.jpeg" },
    { id: "p-food-trail-mix-assorted", name: "Premium Grab-and-Go Trail Mix — Assorted Pouches", category: "foods", categoryLabel: "Foods", price: 690, image: "food.jpeg" },
    { id: "p-food-hersheys-xl-box", name: "Hershey's Cookies 'n' Creme XL — Bulk Display Box", category: "foods", categoryLabel: "Foods", price: 8490, image: "food_6.jpeg" },
    { id: "p-food-kinder-schoko-bons", name: "Kinder Schoko-Bons Crispy — Share Bag", category: "foods", categoryLabel: "Foods", price: 2390, image: "food_5.jpeg" },
    { id: "p-food-oreo-family", name: "Oreo Chocolate Sandwich Cookies — Family Pack (405g)", category: "foods", categoryLabel: "Foods", price: 1890, image: "food_8.jpeg" },
    { id: "p-food-dried-orange", name: "FreshPacked Premium Dried Orange Slices", category: "foods", categoryLabel: "Foods", price: 1290, image: "food_2.jpeg" },
    { id: "p-food-dried-green-apple", name: "FreshPacked Premium Dried Green Apple Slices", category: "foods", categoryLabel: "Foods", price: 1290, image: "food_2.jpeg" },
    { id: "p-food-dried-pineapple", name: "FreshPacked Premium Dried Pineapple", category: "foods", categoryLabel: "Foods", price: 1390, image: "food_2.jpeg" },
    { id: "p-food-dried-kiwi", name: "FreshPacked Premium Dried Kiwi Slices", category: "foods", categoryLabel: "Foods", price: 1420, image: "food_2.jpeg" },
    { id: "p-food-dried-banana", name: "FreshPacked Premium Dried Banana Chips", category: "foods", categoryLabel: "Foods", price: 1190, image: "food_2.jpeg" },
    { id: "p-food-ferrero-rocher", name: "Ferrero Rocher Fine Hazelnut Chocolates — Gift Box (600g)", category: "foods", categoryLabel: "Foods", price: 13499, image: "food_9.jpeg" },
    { id: "p-makeup", name: "Translucent Setting Powder", category: "makeup", categoryLabel: "Cosmetic collection", price: 2199, image: "makeup_3.jpeg" },
    { id: "p-cos-cheek-duo", name: "Pressed Cheek Colour Duo", category: "makeup", categoryLabel: "Cosmetic collection", price: 4199, image: "makeup_2.jpeg" },
    { id: "p-cos-concealer", name: "Radiant Cream Concealer — Doe Foot", category: "makeup", categoryLabel: "Cosmetic collection", price: 6890, image: "powder.jpeg" },
    { id: "p-cos-sheet-masks", name: "Fruit Essence Sheet Mask Assortment", category: "makeup", categoryLabel: "Cosmetic collection", price: 2499, image: "face_mask.jpeg" },
    { id: "p-cos-lip-tints", name: "Peptide Lip Tint Wardrobe — Five", category: "makeup", categoryLabel: "Cosmetic collection", price: 12499, image: "makeup_1.jpeg" },
    { id: "p-cos-foundation-spf", name: "Healthy Glow Foundation SPF 25", category: "makeup", categoryLabel: "Cosmetic collection", price: 18999, image: "foundation.jpeg" },
    { id: "p-cos-lipstick-matte", name: "Powder Kiss Matte Lipstick — Dusty Rose", category: "makeup", categoryLabel: "Cosmetic collection", price: 4590, image: "lipstick.jpeg" },
    { id: "p-cos-lip-oil", name: "Hydrating Lip Oil — Pink Gleam", category: "makeup", categoryLabel: "Cosmetic collection", price: 2890, image: "lipbalm.jpeg" },
    { id: "p-cos-liquid-blush", name: "Crystal Veil Liquid Colour Flush", category: "makeup", categoryLabel: "Cosmetic collection", price: 3490, image: "cos1.jpeg" },
    { id: "p-cos-mascara", name: "Plush Volume Mascara — Noir", category: "makeup", categoryLabel: "Cosmetic collection", price: 5290, image: "mascara.jpeg" },
    { id: "p-cos-powder-foundation", name: "Studio Pressed Powder Plus Foundation", category: "makeup", categoryLabel: "Cosmetic collection", price: 9890, image: "foundation_1.jpeg" },
    { id: "p-cos-edp-midnight", name: "Midnight Sky Eau de Parfum — 100 ml", category: "makeup", categoryLabel: "Cosmetic collection", price: 28999, image: "perfume.jpeg" },
    { id: "p-cos-edp-ribbon", name: "Ribbon Rose Eau de Parfum", category: "makeup", categoryLabel: "Cosmetic collection", price: 31999, image: "perfume_1.jpeg" },
    { id: "p-cos-edp-prism", name: "Prism Blush Eau de Parfum", category: "makeup", categoryLabel: "Cosmetic collection", price: 26999, image: "perfume_5.jpeg" },
    { id: "p-cos-edp-stiletto", name: "Stiletto Muse Eau de Parfum — 50 ml", category: "makeup", categoryLabel: "Cosmetic collection", price: 24499, image: "perfume_4.jpeg" },
    { id: "p-cos-edp-facet", name: "Facet Crystal Eau de Parfum — Bamboo", category: "makeup", categoryLabel: "Cosmetic collection", price: 23299, image: "perfume_2.jpeg" },
    { id: "p-cos-body-mists", name: "Brazilian Crush Body Mist Discovery — Six", category: "makeup", categoryLabel: "Cosmetic collection", price: 8990, image: "perfume_1.jpeg" },
    { id: "p-cos-edp-intense", name: "Parisienne Intense Eau de Parfum — 50 ml", category: "makeup", categoryLabel: "Cosmetic collection", price: 38999, image: "perfume.jpeg" },
    { id: "p-bags", name: "Quilted Crossbody Bag", category: "bags", categoryLabel: "Bag collection", price: 18500, image: "side_bag.jpeg" },
    { id: "p-bag-jwpei-hobo", name: "Ruched Handle Crescent Hobo — Black", category: "bags", categoryLabel: "Bag collection", price: 14299, image: "bag2.jpeg" },
    { id: "p-bag-cream-crossbody", name: "Starlit Cream Mini Crossbody", category: "bags", categoryLabel: "Bag collection", price: 7650, image: "bag1.jpeg" },
    { id: "p-bag-lavender-spinner", name: "Lavender Hard-shell Spinner Carry-on", category: "bags", categoryLabel: "Bag collection", price: 32499, image: "bag3.jpeg" },
    { id: "p-bag-vankany-pack", name: "Vankany Sage Multi-Pocket Backpack", category: "bags", categoryLabel: "Bag collection", price: 9499, image: "bag4.jpeg" },
    { id: "p-bag-quilted-mini", name: "Diamond Quilt Chain Mini Flap", category: "bags", categoryLabel: "Bag collection", price: 89999, image: "bag5.jpeg" }
  ];


  function formatLkr(n) {
    return "LKR " + Number(n).toLocaleString("en-LK", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function shortDisplayName(p) {
    if (!p || !p.name) return "";
    var n = String(p.name);
    var seps = [" — ", " – ", " - "];
    for (var i = 0; i < seps.length; i++) {
      var j = n.indexOf(seps[i]);
      if (j > 0 && j <= 44) return n.slice(0, j).trim();
    }
    if (n.length > 38) return n.slice(0, 36).trim() + "…";
    return n;
  }

  function unitPrice(p) {
    if (!p) return 0;
    if (p.category === "electronics") return Math.round(p.price * 0.75);
    return p.price;
  }


  function getJson(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) { return fallback; }
  }

  function setJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getInventory() {
    var map = getJson(STORAGE_INVENTORY, null);
    if (!map || typeof map !== "object") {
      map = {};
      PRODUCTS.forEach(function (p) { map[p.id] = p.stock; });
      setJson(STORAGE_INVENTORY, map);
    } else {
      var changed = false;
      PRODUCTS.forEach(function (p) {
        if (!Object.prototype.hasOwnProperty.call(map, p.id)) { map[p.id] = p.stock; changed = true; }
      });
      if (changed) saveInventory(map);
    }
    return map;
  }

  function saveInventory(map) { setJson(STORAGE_INVENTORY, map); }
  function getCart() { var c = getJson(STORAGE_CART, []); return Array.isArray(c) ? c : []; }
  function saveCart(lines) { setJson(STORAGE_CART, lines); }
  function getUser() { return getJson(STORAGE_USER, null); }
  function saveUser(user) { if (user) setJson(STORAGE_USER, user); else localStorage.removeItem(STORAGE_USER); }
  function productById(id) { for (var i = 0; i < PRODUCTS.length; i++) { if (PRODUCTS[i].id === id) return PRODUCTS[i]; } return null; }

  function getCartQtyForProduct(productId) {
    var sum = 0;
    getCart().forEach(function (l) { if (l.productId === productId) sum += l.quantity; });
    return sum;
  }

  function sanitizeCart() {
    var cart = getCart();
    var next = [];
    var removed = false;
    cart.forEach(function (line) { if (productById(line.productId)) next.push(line); else removed = true; });
    if (removed) { saveCart(next); updateCartCount(); renderCart(); }
  }


  var MOCK_DELIVERY_FLAT = 450;
  var MOCK_FREE_SHIP_MIN = 25000;
  var MOCK_SETERA10_RATE = 0.1;

  function cartDeliveryFee(sub) { if (sub <= 0) return 0; return sub >= MOCK_FREE_SHIP_MIN ? 0 : MOCK_DELIVERY_FLAT; }
  function cartPromoDeduction(sub) { if (sub <= 0) return 0; return Math.round(sub * MOCK_SETERA10_RATE); }
  function cartSubtotal() {
    var total = 0;
    getCart().forEach(function (l) { var p = productById(l.productId); if (p) total += unitPrice(p) * l.quantity; });
    return total;
  }
  function cartGrandTotal() {
    var sub = cartSubtotal();
    return Math.max(0, sub - cartPromoDeduction(sub) + cartDeliveryFee(sub));
  }


  function summaryRowsHtml() {
    var sub = cartSubtotal();
    var deli = cartDeliveryFee(sub);
    var promo = cartPromoDeduction(sub);

    var deliVal = (deli === 0 && sub === 0)
      ? '<span class="summary-row__value">' + formatLkr(0) + '</span>'
      : deli === 0
        ? '<span class="summary-row__value is-free">Free</span>'
        : '<span class="summary-row__value">' + formatLkr(deli) + '</span>';

    return (
      '<div class="summary-row">' +
        '<span class="summary-row__label">Subtotal</span>' +
        '<span class="summary-row__value">' + formatLkr(sub) + '</span>' +
      '</div>' +
      '<div class="summary-row">' +
        '<span class="summary-row__label"><span class="summary-row__badge">−10%</span>SETERA10</span>' +
        '<span class="summary-row__value is-discount">− ' + formatLkr(promo) + '</span>' +
      '</div>' +
      '<div class="summary-row">' +
        '<span class="summary-row__label">Delivery</span>' +
        deliVal +
      '</div>'
    );
  }

  function totalsBreakdownHtml() {
    var sub = cartSubtotal();
    var deli = cartDeliveryFee(sub);
    var promo = cartPromoDeduction(sub);
    var total = Math.max(0, sub - promo + deli);
    return (
      '<dl class="cart-breakdown-lines">' +
      '<dt>Subtotal</dt><dd>' + formatLkr(sub) + '</dd>' +
      '<dt>Delivery</dt><dd>' + (deli === 0 && sub === 0 ? formatLkr(0) : deli === 0 ? 'Free' : formatLkr(deli)) + '</dd>' +
      '<dt><span class="cart-breakdown-badge">−10%</span> SETERA10</dt><dd>− ' + formatLkr(promo) + '</dd>' +
      '</dl>' +
      '<div class="cart-breakdown-total"><span>Total</span><strong>' + formatLkr(total) + '</strong></div>'
    );
  }


  function addToCart(productId, qty) {
    qty = qty == null ? 1 : Math.max(1, Math.min(99, parseInt(qty, 10) || 1));
    var p = productById(productId);
    if (!p) return;
    var inCart = getCartQtyForProduct(productId);
    if (inCart + qty > 99) { showToast("Maximum 99 units per item in your basket."); return; }
    var cart = getCart();
    var found = false;
    cart.forEach(function (line) { if (line.productId === productId) { line.quantity += qty; found = true; } });
    if (!found) cart.push({ productId: productId, quantity: qty });
    saveCart(cart);
    showToast(qty > 1 ? "Added " + qty + " to basket" : "Added to basket");
    renderCart();
    updateCartCount();
  }

  function setLineQuantity(productId, qty) {
    var p = productById(productId);
    if (!p) return;
    qty = Math.max(0, Math.min(qty, 99));
    var cart = getCart();
    var next = [];
    cart.forEach(function (line) {
      if (line.productId !== productId) next.push(line);
      else if (qty > 0) next.push({ productId: productId, quantity: qty });
    });
    saveCart(next);
    renderCart();
    updateCartCount();
    renderProducts();
  }

  function removeLine(productId) {
    setLineQuantity(productId, 0);
    showToast("Removed from basket");
  }


  function updateCartCount() {
    var n = 0;
    getCart().forEach(function (line) { n += line.quantity; });

    document.querySelectorAll(".js-cart-count").forEach(function (el) { el.textContent = String(n); });
    document.querySelectorAll(".js-cart-panel-count").forEach(function (el) {
      el.textContent = n === 1 ? "1 item" : n + " items";
    });
    document.querySelectorAll(".js-cart-nav-btn").forEach(function (btn) {
      btn.setAttribute("aria-label", n === 0 ? "Open shopping cart, basket is empty" : "Open shopping cart, " + n + " items");
    });
    document.querySelectorAll(".js-checkout-trigger").forEach(function (el) { el.disabled = n === 0; });

    var totalAmt = document.getElementById("cartTotalAmt");
    if (totalAmt) totalAmt.textContent = formatLkr(cartGrandTotal());
  }


  function renderCart() {
    var itemsHost = document.getElementById("cartLines");
    var breakdownEl = document.getElementById("cartBreakdown");
    var totalAmt = document.getElementById("cartTotalAmt");
    var panelCount = document.querySelector(".js-cart-panel-count");
    if (!itemsHost) return;

    var cart = getCart();
    var totalItems = 0;
    cart.forEach(function (l) { totalItems += l.quantity; });

    if (panelCount) panelCount.textContent = totalItems === 1 ? "1 item" : totalItems + " items";

    if (cart.length === 0) {
      itemsHost.innerHTML =
        '<div class="cart-empty-state">' +
        '<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">' +
        '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
        '<line x1="3" y1="6" x2="21" y2="6"/>' +
        '<path d="M16 10a4 4 0 01-8 0"/>' +
        '</svg><p>Your basket is empty</p></div>';
      if (breakdownEl) breakdownEl.innerHTML = summaryRowsHtml();
      if (totalAmt) totalAmt.textContent = formatLkr(0);
      return;
    }

    var html = "";
    cart.forEach(function (line) {
      var p = productById(line.productId);
      if (!p) return;
      html +=
        '<div class="cart-line-v2">' +
          '<img class="cart-line-v2__img" src="' + escapeAttr(p.image) + '" alt="' + escapeAttr(shortDisplayName(p)) + '" />' +
          '<div class="cart-line-v2__info">' +
            '<p class="cart-line-v2__cat">' + escapeHtml(p.categoryLabel) + '</p>' +
            '<h4 class="cart-line-v2__name">' + escapeHtml(shortDisplayName(p)) + '</h4>' +
            '<p class="cart-line-v2__each">Each · ' + formatLkr(unitPrice(p)) + '</p>' +
            '<div class="cart-line-v2__qty-row">' +
              '<div class="qty-stepper">' +
                '<button type="button" class="qty-stepper__btn" data-qty="' + escapeAttr(p.id) + '" data-d="-1" aria-label="Decrease quantity">−</button>' +
                '<span class="qty-stepper__val">' + line.quantity + '</span>' +
                '<button type="button" class="qty-stepper__btn" data-qty="' + escapeAttr(p.id) + '" data-d="1" aria-label="Increase quantity">+</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;align-items:flex-end;justify-content:space-between;flex-shrink:0;gap:0.5rem;">' +
            '<button type="button" class="cart-line-v2__del" data-remove="' + escapeAttr(p.id) + '" aria-label="Remove item">' +
              '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
              '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>' +
              '</svg>' +
            '</button>' +
            '<strong class="cart-line-v2__total">' + formatLkr(unitPrice(p) * line.quantity) + '</strong>' +
          '</div>' +
        '</div>';
    });

    itemsHost.innerHTML = html;
    if (breakdownEl) breakdownEl.innerHTML = summaryRowsHtml();
    if (totalAmt) totalAmt.textContent = formatLkr(cartGrandTotal());

    itemsHost.querySelectorAll("[data-qty]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-qty");
        var delta = parseInt(btn.getAttribute("data-d"), 10);
        var cart = getCart();
        var q = 0;
        cart.forEach(function (l) { if (l.productId === id) q = l.quantity; });
        setLineQuantity(id, q + delta);
      });
    });

    itemsHost.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () { removeLine(btn.getAttribute("data-remove")); });
    });
  }


  function escapeHtml(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function escapeAttr(s) { return escapeHtml(s); }


  var activeCategory = "all";
  var searchQuery = "";

  function renderCategoryTabs() {
    var host = document.getElementById("categoryTabs");
    if (!host) return;
    host.innerHTML = "";
    CATEGORIES.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", c.id === activeCategory ? "true" : "false");
      b.textContent = c.label;
      b.dataset.cat = c.id;
      b.addEventListener("click", function () { activeCategory = c.id; renderCategoryTabs(); renderProducts(); });
      host.appendChild(b);
    });
  }

  function productMatches(p) {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
    if (!searchQuery.trim()) return true;
    var q = searchQuery.trim().toLowerCase();
    return p.name.toLowerCase().indexOf(q) !== -1 || p.categoryLabel.toLowerCase().indexOf(q) !== -1;
  }

  function renderProducts() {
    var host = document.getElementById("productGrid");
    if (!host) return;
    var html = "";
    PRODUCTS.forEach(function (p) {
      if (!productMatches(p)) return;
      var label = shortDisplayName(p);
      var inCart = getCartQtyForProduct(p.id);
      var canAdd = inCart < 99;
      html +=
        '<article class="product-card" data-id="' + escapeAttr(p.id) + '">' +
        '<figure><img src="' + escapeAttr(p.image) + '" alt="' + escapeAttr(label) + '" loading="lazy" /></figure>' +
        '<div class="product-body">' +
        '<h3>' + escapeHtml(label) + '</h3>' +
        '<div class="product-meta">' +
        (p.category === "electronics"
          ? '<span class="price">' + formatLkr(unitPrice(p)) + '</span><span class="price-was">' + formatLkr(p.price) + '</span><span class="price-badge" title="Electronics promotion">25% off</span>'
          : '<span class="price">' + formatLkr(p.price) + '</span>') +
        '</div>' +
        '<div class="product-buy-row">' +
        '<div class="qty-pill qty-pill--product" aria-label="Quantity before add">' +
        '<button type="button" class="qty-pill__btn" data-product-qty-delta="-1" data-pid="' + escapeAttr(p.id) + '" aria-label="Decrease quantity">−</button>' +
        '<span class="qty-pill__val product-qty-val">1</span>' +
        '<button type="button" class="qty-pill__btn" data-product-qty-delta="1" data-pid="' + escapeAttr(p.id) + '" aria-label="Increase quantity">+</button>' +
        '</div>' +
        '<button type="button" class="btn btn-cart-cta add-btn" data-add="' + escapeAttr(p.id) + '"' + (canAdd ? "" : " disabled") + '>Add to cart</button>' +
        '</div>' +
        '</div>' +
        '</article>';
    });
    if (!html) {
      html = '<p class="lede" style="grid-column:1/-1;text-align:center">No products match your filters.</p>';
    }
    host.innerHTML = html;
  }

  function bindProductGridControls() {
    var host = document.getElementById("productGrid");
    if (!host || host.dataset.buyBound === "1") return;
    host.dataset.buyBound = "1";
    host.addEventListener("click", function (e) {
      var step = e.target.closest("[data-product-qty-delta]");
      if (step && host.contains(step)) {
        e.preventDefault();
        var card = step.closest(".product-card");
        if (!card) return;
        var disp = card.querySelector(".product-qty-val");
        if (!disp) return;
        var delta = parseInt(step.getAttribute("data-product-qty-delta"), 10);
        var v = Math.max(1, Math.min(99, (parseInt(disp.textContent, 10) || 1) + delta));
        disp.textContent = String(v);
        return;
      }
      var btn = e.target.closest(".add-btn");
      if (!btn || !host.contains(btn) || btn.disabled) return;
      var card = btn.closest(".product-card");
      var qtyEl = card ? card.querySelector(".product-qty-val") : null;
      var q = Math.max(1, Math.min(99, qtyEl ? parseInt(qtyEl.textContent, 10) || 1 : 1));
      addToCart(btn.getAttribute("data-add"), q);
      if (qtyEl) qtyEl.textContent = "1";
    });
  }


  function showToast(msg) {
    var t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg;
    t.hidden = false;
    t.classList.add("is-visible");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      t.classList.remove("is-visible");
      setTimeout(function () { t.hidden = true; }, 400);
    }, 2600);
  }


  function updateAuthUi() {
    var user = getUser();
    var memberLabel = document.getElementById("memberLabel");
    var authBtn = document.getElementById("authBtn");
    var authBtnLabel = authBtn ? authBtn.querySelector(".auth-btn-label") : null;
    if (!authBtn) return;

    if (user && user.email) {
      if (memberLabel) memberLabel.hidden = false;
      authBtn.dataset.mode = "logout";
      authBtn.setAttribute("aria-label", "Sign out — " + (user.name || user.email));
      authBtn.title = "Sign out";
      
      var dot = authBtn.querySelector(".member-dot");
      if (!dot) {
        dot = document.createElement("span");
        dot.className = "member-dot";
        authBtn.insertBefore(dot, authBtn.firstChild);
      }
      if (authBtnLabel) {
        var name = (user.name || user.email.split("@")[0]).split(" ")[0];
        authBtnLabel.textContent = name.charAt(0).toUpperCase() + name.slice(1, 9);
      }
    } else {
      if (memberLabel) memberLabel.hidden = true;
      authBtn.dataset.mode = "login";
      authBtn.setAttribute("aria-label", "Sign in to SETERA");
      authBtn.title = "Sign in";
      var existingDot = authBtn.querySelector(".member-dot");
      if (existingDot) existingDot.remove();
      if (authBtnLabel) authBtnLabel.textContent = "Sign in";
    }
  }


  function openModal(id) {
    var m = document.getElementById(id);
    if (m) { m.hidden = false; document.body.style.overflow = "hidden"; }
  }

  function closeModal(id) {
    var m = document.getElementById(id);
    if (m) { m.hidden = true; document.body.style.overflow = ""; }
  }

  function openCart() {
    var panel = document.getElementById("cartPanel");
    if (panel) { panel.classList.add("is-open"); panel.setAttribute("aria-hidden", "false"); }
    renderCart();
  }

  function closeCart() {
    var panel = document.getElementById("cartPanel");
    if (panel) { panel.classList.remove("is-open"); panel.setAttribute("aria-hidden", "true"); }
  }


  function initCheckoutSummary() {
    var el = document.getElementById("orderSummary");
    if (!el) return;
    var lines = [];
    getCart().forEach(function (l) {
      var p = productById(l.productId);
      if (p) lines.push(
        "<div class='checkout-line'><span class='checkout-line-name'>" +
        escapeHtml(shortDisplayName(p)) + " × " + l.quantity +
        "</span><span>" + formatLkr(unitPrice(p) * l.quantity) + "</span></div>"
      );
    });
    var hasElectronics = getCart().some(function (l) { var pr = productById(l.productId); return pr && pr.category === "electronics"; });
    el.innerHTML =
      "<div class='checkout-summary-head'>Order summary</div>" +
      (lines.length ? "<div class='checkout-line-list'>" + lines.join("") + "</div>" : "") +
      '<div class="checkout-totals">' + totalsBreakdownHtml() + "</div>" +
      (hasElectronics ? "<p class='order-promo-note'>25% electronics promotion already applied in line prices.</p>" : "");
  }

  function placeOrder(e) {
    e.preventDefault();
    var cart = getCart();
    if (!cart.length) { showToast("Basket is empty."); return; }

    var email     = document.getElementById("coEmail").value.trim();
    var fullName  = (document.getElementById("coFullName")   || {}).value || "";
    var nameParts = fullName.trim().split(" ");
    var firstName = nameParts[0] || "Guest";
    var lastName  = nameParts.slice(1).join(" ") || "-";
    var address   = (document.getElementById("coAddress")    || {}).value || "N/A";
    var city      = (document.getElementById("coCity")       || {}).value || "N/A";
    var phone     = (document.getElementById("coPhone")      || {}).value || "N/A";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("Please enter a valid email address."); return;
    }

    var cartPayload = [];
    cart.forEach(function (l) {
      var p = productById(l.productId);
      if (p) cartPayload.push({
        productId: p.id,
        name:      p.name,
        category:  p.category,
        price:     p.price,
        quantity:  l.quantity
      });
    });

    var user  = getUser();
    var token = user ? user.token : null;

    var note = document.getElementById("checkoutNote");
    if (note) note.textContent = "Placing order…";

    apiPost("/orders", {
      email:     email,
      firstName: firstName,
      lastName:  lastName,
      address:   address,
      city:      city,
      phone:     phone,
      cart:      cartPayload
    }, token)
      .then(function (res) {
        if (res.ok) {
          var grand = res.data.grandTotal;
          var orders = getJson(STORAGE_ORDERS, []);
          orders.push({ id: res.data.orderRef, at: new Date().toISOString(), email: email, total: grand, lines: cart.slice() });
          setJson(STORAGE_ORDERS, orders);

          saveCart([]);
          renderCart();
          updateCartCount();
          renderProducts();
          closeModal("checkoutModal");
          closeCart();
          document.getElementById("checkoutForm").reset();
          if (note) note.textContent = "";
          showToast("Thank you! Order " + res.data.orderRef + " placed.");
        } else {
          if (note) note.textContent = (res.data && res.data.error) ? res.data.error : "Failed to place order.";
        }
      })
      .catch(function () {
        
        var grand = cartGrandTotal();
        var orders = getJson(STORAGE_ORDERS, []);
        orders.push({
          id: "ORD-" + Date.now(), at: new Date().toISOString(),
          email: email, total: grand, lines: cart.slice(), user: user
        });
        setJson(STORAGE_ORDERS, orders);
        saveCart([]);
        renderCart();
        updateCartCount();
        renderProducts();
        closeModal("checkoutModal");
        closeCart();
        document.getElementById("checkoutForm").reset();
        if (note) note.textContent = "Order saved locally (backend offline). Total: " + formatLkr(grand);
        showToast("Thank you — order placed.");
      });
  }


  var slideIndex = 0;
  var slideTimer = null;
  var slides = [];

  function pauseAllVideos() {
    document.querySelectorAll(".slide-video").forEach(function (v) {
      v.pause();
      try { v.currentTime = 0; } catch (e) {}
    });
  }

  function goSlide(i) {
    slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
    if (!slides.length) return;
    slideIndex = (i + slides.length) % slides.length;
    slides.forEach(function (s, idx) { s.classList.toggle("active", idx === slideIndex); });
    document.querySelectorAll(".slide-dot").forEach(function (d, idx) { d.classList.toggle("active", idx === slideIndex); });
    pauseAllVideos();
    var active = slides[slideIndex];
    if (active && active.classList.contains("slide--video")) {
      var vid = active.querySelector(".slide-video");
      if (vid) { var p = vid.play(); if (p && typeof p.catch === "function") p.catch(function () {}); }
    }
    clearInterval(slideTimer);
    slideTimer = setInterval(function () { goSlide(slideIndex + 1); }, 9000);
  }

  function initSlideshow() {
    slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
    document.getElementById("slidePrev").addEventListener("click", function () { goSlide(slideIndex - 1); });
    document.getElementById("slideNext").addEventListener("click", function () { goSlide(slideIndex + 1); });
    document.querySelectorAll(".slide-dot").forEach(function (d) {
      d.addEventListener("click", function () { goSlide(parseInt(d.getAttribute("data-go"), 10)); });
    });
    goSlide(0);
  }


  function init() {
    getInventory();
    sanitizeCart();
    renderCategoryTabs();
    renderProducts();
    bindProductGridControls();
    updateCartCount();
    renderCart();
    updateAuthUi();
    initSlideshow();

    document.querySelectorAll(".js-open-basket").forEach(function (el) {
      el.addEventListener("click", openCart);
    });

    document.querySelectorAll(".js-open-checkout").forEach(function (el) {
      el.addEventListener("click", function () {
        if (!getCart().length) {
          showToast("Use Add to cart on products below, then open Checkout.");
          var cat = document.getElementById("catalog");
          if (cat) cat.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        var cn = document.getElementById("checkoutNote");
        if (cn) cn.textContent = "";
        initCheckoutSummary();
        openModal("checkoutModal");
      });
    });

    document.getElementById("closeCart").addEventListener("click", closeCart);
    document.getElementById("cartScrim").addEventListener("click", closeCart);

    var continueBtn = document.getElementById("continueShoppingBtn");
    if (continueBtn) continueBtn.addEventListener("click", closeCart);

    document.getElementById("checkoutOpen").addEventListener("click", function () {
      var cn = document.getElementById("checkoutNote");
      if (cn) cn.textContent = "";
      initCheckoutSummary();
      openModal("checkoutModal");
    });

    document.getElementById("closeCheckout").addEventListener("click", function () { closeModal("checkoutModal"); });
    document.querySelector('#checkoutModal [data-close="checkout"]').addEventListener("click", function () { closeModal("checkoutModal"); });
    document.getElementById("checkoutForm").addEventListener("submit", placeOrder);

    document.getElementById("authBtn").addEventListener("click", function () {
      if (document.getElementById("authBtn").dataset.mode === "logout") {
        saveUser(null);
        updateAuthUi();
        showToast("You have been logged out.");
      } else {
        openModal("loginModal");
      }
    });

    document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("loginEmail").value.trim();
      var pass  = document.getElementById("loginPass").value;
      if (!email || !pass) return;

      var loginNote = document.getElementById("loginNote");
      if (loginNote) loginNote.textContent = "Signing in…";

      apiPost("/auth/login", { email: email, password: pass })
        .then(function (res) {
          if (res.ok) {
            saveUser({ email: res.data.user.email, name: res.data.user.name, token: res.data.token });
            updateAuthUi();
            closeModal("loginModal");
            showToast("Welcome back, " + res.data.user.name + "!");
            if (loginNote) loginNote.textContent = "";
          } else {
            if (loginNote) loginNote.textContent = res.data.error || "Login failed.";
          }
        })
        .catch(function () {
          
          var name = email.split("@")[0];
          saveUser({ email: email, name: name.replace(/\./g, " ") });
          updateAuthUi();
          closeModal("loginModal");
          showToast("Welcome to SETERA");
          if (loginNote) loginNote.textContent = "";
        });
    });

    
    document.getElementById("tabLoginBtn").addEventListener("click", function () {
      document.getElementById("tabLoginPanel").removeAttribute("hidden");
      document.getElementById("tabRegisterPanel").setAttribute("hidden", "");
      this.style.color = "var(--gold, #c8a96e)";
      this.style.borderBottomColor = "currentColor";
      document.getElementById("tabRegisterBtn").style.color = "rgba(255,255,255,0.45)";
      document.getElementById("tabRegisterBtn").style.borderBottomColor = "transparent";
    });
    document.getElementById("tabRegisterBtn").addEventListener("click", function () {
      document.getElementById("tabRegisterPanel").removeAttribute("hidden");
      document.getElementById("tabLoginPanel").setAttribute("hidden", "");
      this.style.color = "var(--gold, #c8a96e)";
      this.style.borderBottomColor = "currentColor";
      document.getElementById("tabLoginBtn").style.color = "rgba(255,255,255,0.45)";
      document.getElementById("tabLoginBtn").style.borderBottomColor = "transparent";
    });

    
    document.getElementById("registerForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var name  = document.getElementById("regName").value.trim();
      var email = document.getElementById("regEmail").value.trim();
      var pass  = document.getElementById("regPass").value;
      var note  = document.getElementById("registerNote");
      if (!name || !email || !pass) return;

      if (note) note.textContent = "Creating account…";

      apiPost("/auth/register", { name: name, email: email, password: pass })
        .then(function (res) {
          if (res.ok) {
            saveUser({ email: res.data.user.email, name: res.data.user.name, token: res.data.token });
            updateAuthUi();
            closeModal("loginModal");
            showToast("Account created! Welcome, " + res.data.user.name + ".");
            if (note) note.textContent = "";
          } else {
            if (note) note.textContent = res.data.error || "Registration failed.";
          }
        })
        .catch(function () {
          if (note) note.textContent = "Cannot connect to server. Please try later.";
        });
    });

    document.getElementById("closeLogin").addEventListener("click", function () { closeModal("loginModal"); });
    document.querySelector('#loginModal [data-close="login"]').addEventListener("click", function () { closeModal("loginModal"); });

    var searchToggle = document.getElementById("searchToggle");
    var searchBar = document.getElementById("searchBar");
    var searchInput = document.getElementById("searchInput");
    if (searchToggle && searchBar && searchInput) {
      searchToggle.addEventListener("click", function () {
        var hidden = searchBar.hasAttribute("hidden");
        if (hidden) searchBar.removeAttribute("hidden");
        else searchBar.setAttribute("hidden", "");
        if (!hidden) searchInput.value = "";
        searchQuery = "";
        renderProducts();
        if (!searchBar.hasAttribute("hidden")) searchInput.focus();
      });
      searchInput.addEventListener("input", function () { searchQuery = searchInput.value; renderProducts(); });
    }

    document.querySelectorAll(".catalog-filter-link").forEach(function (a) {
      a.addEventListener("click", function () {
        var cat = a.getAttribute("data-category");
        if (!cat) return;
        var ok = CATEGORIES.some(function (c) { return c.id === cat; });
        if (!ok) return;
        activeCategory = cat;
        renderCategoryTabs();
        renderProducts();
        if (cat === "electronics") showToast("Electronics — 25% off applied at checkout.");
        var catAnchor = document.getElementById("catalog");
        if (catAnchor) window.requestAnimationFrame(function () { catAnchor.scrollIntoView({ behavior: "smooth", block: "start" }); });
      });
    });

    var contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var msgs = getJson(STORAGE_MESSAGES, []);
        msgs.push({
          at: new Date().toISOString(),
          name: document.getElementById("cfName").value,
          email: document.getElementById("cfEmail").value,
          message: document.getElementById("cfMsg").value
        });
        setJson(STORAGE_MESSAGES, msgs);
        var cn = document.getElementById("contactNote");
        if (cn) cn.textContent = "Message saved locally (localStorage).";
        showToast("Thanks — we will get back to you.");
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();