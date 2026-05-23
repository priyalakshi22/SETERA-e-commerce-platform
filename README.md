
# ✦ SETERA — Luxury E-Commerce Platform

<div align="center">

![SETERA Banner](https://img.shields.io/badge/SETERA-Luxury%20E--Commerce-C9A227?style=for-the-badge&labelColor=0A1628&color=C9A227)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![No Framework](https://img.shields.io/badge/No_Framework-Vanilla_JS-C9A227?style=for-the-badge&labelColor=0A1628)

**A premium, fully client-side luxury e-commerce web application built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies, no build tools.**

[🛍️ Live Demo](#) · [📖 Documentation](#features) · [🐛 Report a Bug](../../issues) · [💡 Request a Feature](../../issues)

</div>

---

## 📸 Preview

> *A dark-navy and gold luxury shopping experience — category filtering, live search, two-column cart panel, and full checkout flow.*

---

## 🌟 Overview

SETERA is a **luxury multi-category e-commerce platform** designed and built as part of a Human-Computer Interaction (HCI) module project. It demonstrates professional-grade UI/UX design patterns — including responsive layout, accessible interaction design, and Nielsen's usability heuristics — implemented entirely without frameworks or external dependencies.

The platform covers **8 product categories** (101 products), a **complete shopping workflow**, and a **dark navy × gold** visual identity that communicates premium brand positioning.

---

## ✨ Features

### 🛒 Shopping Experience
- **101 products** across 8 categories: Electronics, Fashion, Home Collections, Baby Collection, Foods, Cosmetics, Bag Collection
- **Live category filtering** via tab bar — instant client-side rendering, no page reload
- **Live search** — real-time product filtering as you type
- **Product grid** — responsive CSS Grid (auto-fill, min 260px columns)
- **Quantity selector** on every product card before adding to cart
- **25% off** automatically applied to all Electronics — shown with original price strikethrough

### 🛍️ Cart & Checkout
- **Two-column slide-in cart panel** — items left, Order Summary right
- **Real-time totals** — subtotal, SETERA10 −10% promo deduction, delivery fee, and grand total update instantly
- **Free delivery** on orders over LKR 25,000 · flat LKR 450 below
- **Promo code SETERA10** — 10% off automatically pre-applied
- **Checkout modal** with delivery details + payment form (mock)
- **localStorage persistence** — cart survives page refresh

### 🎨 UI & Design
- **Hero slideshow** — 8 slides (editorial photography + video) with Ken Burns zoom animation
- **Two-column cart panel** — smooth slide-in with blurred backdrop overlay
- **Pill-shaped header buttons** — cart icon + live count badge, gold checkout pill, auth pill
- **Toast notification system** — non-blocking feedback for all cart actions
- **Responsive** — mobile-first CSS Grid and Flexbox; tested from 320px to 1400px
- **ARIA roles** and keyboard navigability throughout

### 🔐 Authentication
- **Sign in / Sign out** — mock authentication with localStorage session persistence
- **Personalised header** — shows user's first name + green presence dot when signed in

---

## 🗂️ Project Structure

```
setera/
├── index.html          # Main application shell
├── styles.css          # Full design system — layout, components, responsive
├── app.js              # All application logic (IIFE module pattern)
├── LOGO.png            # SETERA brand mark
│
├── ── Product Images ──────────────────────────────
│   ├── headset.jpeg / headset_2.jpeg
│   ├── electronic_1.jpeg / samsung.jpeg / ...
│   ├── shoe1.jpeg / shoe_2.jpeg / ...
│   ├── bag1.jpeg / bag2.jpeg / ...
│   ├── perfume.jpeg / makeup_1.jpeg / ...
│   └── [all product images]
│
├── ── Banner Images ───────────────────────────────
│   ├── electronic_banner.jpeg
│   ├── cosmetic_banner.jpeg
│   ├── homedeco_banner.jpeg
│   └── top4.jpeg
│
└── ── Video Assets ────────────────────────────────
    ├── fashion.mp4
    ├── issy.mp4
    └── kendal.mp4
```

---

## 🚀 Getting Started

### Prerequisites
No build tools, no Node.js, no package manager required. Just a browser.

### Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USERNAME/setera.git

# 2. Navigate into the project
cd setera

# 3. Open in your browser
#    Option A — just open the file directly
open index.html

#    Option B — serve with a local server (avoids video autoplay restrictions)
npx serve .
# or
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

> **Note:** Product images and video assets are required for the full experience. Ensure all media files are present in the root directory alongside `index.html`.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 (semantic elements, ARIA) |
| Styling | CSS3 — Custom Properties, Grid, Flexbox, Animations |
| Logic | Vanilla JavaScript (ES5 IIFE module pattern) |
| Persistence | Web Storage API (`localStorage`) |
| Fonts | Google Fonts — Cormorant Garamond + Outfit |
| Icons | Inline SVG |
| Build | None — zero dependencies |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--navy` | `#0A1628` | Primary background |
| `--gold` | `#C9A227` | Accent / CTA / borders |
| `--gold-soft` | `#E8D48B` | Heading text / prices |
| `--font-serif` | Cormorant Garamond | Headlines, product names |
| `--font-sans` | Outfit | Navigation, body, labels |

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout change |
|---|---|
| < 480px | Brand logo shrinks, single-column header |
| < 640px | Header wraps, nav collapses |
| < 680px | Cart panel stacks to single column |

---

## 🧪 Heuristic Evaluation

This project was evaluated against **Nielsen's (1994) ten usability heuristics** as part of the 5CS020 Human-Computer Interaction module. Key findings and resolutions:

| Issue | Severity | Status |
|---|---|---|
| Empty announcement bar | High | ✅ Fixed |
| Dual inconsistent checkout buttons | High | ✅ Fixed |
| Unverifiable electronics discount | Medium | ✅ Fixed |
| Subtle slideshow dot indicator | Medium | ✅ Fixed |
| Cart panel redesigned (two-column) | Medium | ✅ Fixed |
| Header button legibility | Medium | ✅ Fixed |

---

## 🛒 How It Works

### Product Catalogue
All 101 products are defined as a static JavaScript array in `app.js`. Each product has an `id`, `name`, `category`, `price`, and `image` filename. Electronics products automatically receive a 25% discount calculated via the `unitPrice()` function.

### Cart State
Cart data is stored in `localStorage` under the key `setera_cart` as a JSON array of `{ productId, quantity }` objects. All rendering functions read from this storage, ensuring the UI is always in sync with the persisted state.

### Pricing Logic
```
Subtotal     = sum of (unitPrice × quantity) for all cart lines
Promo (−10%) = subtotal × 0.10    [SETERA10 always applied]
Delivery     = LKR 450            [free if subtotal ≥ LKR 25,000]
Grand Total  = subtotal − promo + delivery
```

---

## 📋 localStorage Keys

| Key | Contents |
|---|---|
| `setera_cart` | Array of cart line objects |
| `setera_user` | Signed-in user `{ email, name }` |
| `setera_inventory` | Product stock map |
| `setera_orders` | Array of placed order objects |
| `setera_contact_messages` | Contact form submissions |

---

## 🔮 Planned Features (Future Iterations)

- [ ] Undo on cart item deletion (timed toast action)
- [ ] Persistent visible search bar in header
- [ ] Real-time inline form validation with ARIA live regions
- [ ] First-visit onboarding tooltip for promo code and electronics discount
- [ ] Product sort by price (ascending / descending)
- [ ] Price-range filter slider
- [ ] Wishlist / saved items
- [ ] Real back-end integration (Node.js + database)

---

## 📚 Academic Context

This project was developed for **5CS020 Human-Computer Interaction** at the University of Wolverhampton. The design and evaluation apply concepts from:

- Nielsen, J. (1994) *Heuristic Evaluation* — ten usability heuristics
- Shneiderman, B. (1992) *Designing the User Interface* — eight golden rules
- Marcotte, E. (2010) *Responsive Web Design* — fluid grids, media queries
- Lecture materials from 5CS020 Lectures 6–10

---

## 📄 Licence

This project is for academic and educational purposes.  
© 2026 SETERA. All rights reserved.

---

## 🙏 Acknowledgements

- Google Fonts — [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [Outfit](https://fonts.google.com/specimen/Outfit)
- Product photography — editorial product images used for educational demonstration


---

<div align="center">

**SETERA** · *Shop More, Live Better*

⭐ If you found this project useful, please consider giving it a star!

</div>
