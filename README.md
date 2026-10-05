# Best Shop

A multi-page, fully responsive e-commerce website for travel suitcases and luggage, built with
plain HTML5, SCSS and vanilla JavaScript — no frameworks (no React/Vue/Angular, no Bootstrap).

## Features

> **Portfolio demo.** There is no backend and no real payment: orders, the guest account and
> saved details live in the browser's LocalStorage.

- **Home page** — hero, shop-by-category cards (live product counts), "Popular now" (top products
  by popularity), current offers, "New arrivals" and customer testimonials.
- **Catalog** — breadcrumbs and a heading that follows the selection, search, sorting (price,
  popularity, rating), filters (category, color, size, on sale) with option counts and
  active-filter chips, pagination (12 per page), loading skeletons and an empty state. State is
  kept in the URL; filters open in a drawer on tablets and phones.
- **Product cards** — whole card clickable, fractional star rating, one "Add to cart" button with
  an accessible "Added to cart" notification.
- **Product details** — loaded by `?id=`, tabs, quantity selector, Add to Cart, reviews stored in
  LocalStorage, "You May Also Like" and a "Product not found" state.
- **Cart** — add/update/remove, quantities 1–99, prices always taken from `data.json`, 10% discount
  above $3,000, clear-cart confirmation, cross-tab sync, "Proceed to checkout".
- **Checkout (demo)** — contact, delivery address, delivery method (standard free / express demo
  rate), payment method (simulated card or pay on delivery), inline validation and a sticky order
  summary. Card details are only validated in the page — never stored, logged or sent.
- **Orders** — confirmation page, guest "My account" with order history, and an order details
  page with a status timeline (Order received → Processing → Shipped → Delivered).
- **Contact Us** — real-time validation and a simulated (no backend) send.
- **About Us** — company story, mission, stats and team.

## Tech stack

- HTML5 (semantic markup)
- SCSS (compiled with [Dart Sass](https://sass-lang.com/))
- Vanilla JavaScript (ES5-friendly, no build step, `<script defer>` throughout)
- Browser LocalStorage for the cart, demo orders, saved checkout details and product reviews
- Local JSON as the only data source (`src/assets/data.json`)

## Project structure

```text
best-shop-main/
├─ index.html                # Home page
├─ dist/
│  └─ style.css              # Compiled CSS (generated — do not edit by hand)
├─ src/
│  ├─ html/                  # Catalog, product, cart, checkout, order-success,
│  │                         # account, order, about, contact pages
│  ├─ js/
│  │  ├─ utils/              # Shared modules: paths, cart storage, product cache,
│  │  │                      # card renderer, rating, toast, modal, orders,
│  │  │                      # customer, order view, formatting
│  │  ├─ main.js             # Shared header/nav behavior (every page)
│  │  └─ home.js, catalog.js, product.js, cart.js, checkout.js,
│  │     order-success.js, account.js, order.js, contact.js
│  ├─ scss/
│  │  ├─ abstracts/          # Variables, mixins
│  │  ├─ base/               # Reset, typography
│  │  ├─ components/         # Buttons, forms, modal, product card, rating, toast, order
│  │  ├─ layouts/            # Header, footer
│  │  └─ pages/              # Per-page styles
│  └─ assets/
│     ├─ data.json           # Product catalog (single source of truth)
│     └─ images/
└─ package.json
```

## Getting started

Prerequisites: [Node.js](https://nodejs.org/) (includes npm).

```bash
npm install
npm run dev
```

`npm run dev` compiles every `.scss` file into `dist/style.css` and watches for changes. Open
`index.html` in your browser (directly, or via a tool like VS Code Live Server) once it has
compiled at least once.

### Production build

```bash
npm run build
```

Compiles a minified `dist/style.css` with no source map, suitable for deployment.

## Deploying to Netlify

1. Run `npm install && npm run build` locally (or let Netlify run it — set the build command to
   `npm run build` and the publish directory to `/`).
2. Make sure `dist/style.css` exists before the site is served; if you let Netlify build it,
   the build command above regenerates it automatically.
3. All internal links and asset paths in this project are relative (no leading `/`), so the site
   works whether it's deployed at the domain root or in a subdirectory.

## LocalStorage usage

- `bestshop_cart` — cart contents (`{id, quantity, color, size}[]`). Name, price and image are
  always read from `data.json`; invalid entries and products no longer in the catalog are dropped.
- `bestshop_orders` — demo orders (customer, address, delivery and payment method, items with the
  price at purchase time, statuses). Totals are recalculated from the items when read.
  No card data is ever stored.
- `bestshop_customer` — optional saved contact and delivery details for the next checkout
  ("Save my details" checkbox). Never contains payment data.
- `bestshop_reviews_<productId>` — reviews submitted for a given product.

Clearing your browser's site data resets the cart, orders, saved details and reviews.

## Limitations of this demo

This project has no backend, by design (portfolio demo):

- **Checkout and payment are simulated** — no payment provider, no real transaction; card fields
  are only format-checked in the browser.
- **Orders and the account** exist only in this browser (LocalStorage); there is no login, and
  order statuses do not change by themselves.
- **Contact form** does not send real emails.
- **Reviews** are stored per browser, not shared between visitors.

A production version would need a backend/API for orders, payments (verified server-side),
authentication and email delivery.
