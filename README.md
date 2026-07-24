# Best Shop

A multi-page, fully responsive e-commerce website for travel suitcases and luggage, built with
plain HTML5, SCSS and vanilla JavaScript — no frameworks (no React/Vue/Angular, no Bootstrap).

## Features

- **Home page** — hero section, a "Travel Suitcases" showcase, shop-by-category tiles, Selected
  Products and New Products Arrival (loaded from JSON), a store-benefits section, a promotional
  banner and a newsletter signup.
- **Catalog** — products loaded from local JSON with combinable filters (category, color, size,
  on-sale), sorting (price, popularity, rating), live search, pagination (12 per page), and a
  "Top Best Sets" panel. Filter/sort/search/page state is kept in the URL query string, and the
  filter panel collapses into a slide-in drawer on mobile.
- **Product details** — loaded dynamically by `?id=` from the catalog data, with breadcrumbs,
  Description / Additional Information / Reviews tabs, a quantity selector (minimum 1), Add to
  Cart, a "You May Also Like" section, per-product reviews stored in LocalStorage, and a graceful
  "Product not found" state for invalid or missing IDs.
- **Cart** — a single shared cart module used by every page: add/update/remove items, an empty
  state, a 10% discount when the subtotal exceeds $3,000, a custom confirmation dialog for
  clearing the cart, and a demo checkout form (no real payment is processed).
- **Login (demo)** — email/password validation with inline errors, show/hide password, a
  "Remember me" option, and Escape/click-outside/scroll-locked modal behavior. This is a
  LocalStorage-only demo, not real authentication.
- **Contact Us** — real-time email validation, per-field error messages, and a simulated
  (no backend) send with a brief "Sending…" state.
- **About Us** — company story, mission, stats and team.

## Tech stack

- HTML5 (semantic markup)
- SCSS (compiled with [Dart Sass](https://sass-lang.com/))
- Vanilla JavaScript (ES5-friendly, no build step, `<script defer>` throughout)
- Browser LocalStorage for the cart, login session and product reviews
- Local JSON as the only data source (`src/assets/data.json`)

## Project structure

```text
best-shop-main/
├─ index.html                # Home page
├─ dist/
│  └─ style.css              # Compiled CSS (generated — do not edit by hand)
├─ src/
│  ├─ html/                  # Catalog, product, cart, about, contact pages
│  ├─ js/
│  │  ├─ utils/              # Shared modules: paths, cart storage, product cache,
│  │  │                      # card renderer, modal helper
│  │  ├─ main.js             # Shared header/nav/login behavior (every page)
│  │  └─ home.js, catalog.js, product.js, cart.js, contact.js
│  ├─ scss/
│  │  ├─ abstracts/          # Variables, mixins
│  │  ├─ base/               # Reset, fonts
│  │  ├─ components/         # Buttons, forms, modal, product card
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

- `bestshop_cart` — cart contents (`{id, name, price, imageUrl, quantity, color, size}[]`).
- `loggedUser` (localStorage or sessionStorage, depending on "Remember me") — the demo logged-in
  email.
- `bestshop_reviews_<productId>` — reviews submitted for a given product.

Clearing your browser's site data will reset the cart, login session and reviews.

## Limitations of this demo

This project has no backend, by design:

- **Login** is a LocalStorage demo — there is no real user database, password hashing, or
  session management.
- **Checkout** does not process real payments; placing an order simply clears the cart and shows
  a confirmation message.
- **Contact form** and **newsletter signup** do not send real emails.
- **Reviews** are stored per browser (LocalStorage), not shared between visitors.

To make these production-ready, they would need a backend/API (e.g. for auth, orders and email
delivery such as EmailJS or a transactional email API).
