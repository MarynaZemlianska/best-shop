# PROJECT_CONTEXT.md

## Project Name

**Best Shop — Travel Suitcases & Luggage Online Store**

This file contains the factual context of the project.

Claude must use this file together with `CLAUDE.md`.

`CLAUDE.md` defines **how Claude should work**.

`PROJECT_CONTEXT.md` defines **what this project is, how it currently works, and what we are building**.

Do not invent project facts that are not confirmed in this file or in the actual codebase.

If the codebase contradicts this document, inspect the code and report the discrepancy.

---

# 1. PROJECT TYPE

Best Shop is an existing e-commerce website focused on:

- travel suitcases;
- cabin luggage;
- medium and large suitcases;
- luggage sets;
- travel bags;
- backpacks;
- travel accessories.

The project is not a demo.

The long-term goal is to develop it into a reliable, modern, production-ready online store.

---

# 2. MAIN BUSINESS GOAL

The website should allow a customer to comfortably complete the entire purchasing journey:

Homepage  
→ Catalog  
→ Category  
→ Product  
→ Cart  
→ Checkout  
→ Payment  
→ Order confirmation

Additional customer functionality may include:

- account registration;
- login;
- order history;
- wishlist;
- saved addresses;
- order tracking;
- product search;
- filters;
- sorting.

The exact functionality must always be verified against the current codebase.

---

# 3. DEVELOPMENT APPROACH

This is an existing project.

Do not rebuild it from scratch without a strong reason.

The preferred approach is:

1. inspect existing code;
2. understand existing architecture;
3. preserve working functionality;
4. improve weak areas;
5. remove technical debt gradually;
6. introduce new functionality in controlled stages.

Large rewrites should only happen when justified.

---

# 4. TARGET QUALITY

The final product should feel like a modern European e-commerce store.

The website should be:

- professional;
- trustworthy;
- modern;
- responsive;
- fast;
- secure;
- easy to use;
- visually consistent;
- maintainable.

The project should not feel like a generic outdated shop template.

---

# 5. DESIGN DIRECTION

The preferred visual direction is:

- clean;
- minimal;
- premium;
- modern;
- spacious;
- product-focused.

Use strong visual hierarchy.

The design should emphasize:

- product photography;
- clear prices;
- clear calls to action;
- easy navigation;
- trust;
- fast product discovery.

Avoid excessive decoration.

Avoid unnecessary gradients, shadows, animations and visual noise.

Animations should be subtle and functional.

---

# 6. RESPONSIVE PRIORITY

Mobile UX is a major priority.

The website must work correctly on:

- small phones;
- modern phones;
- tablets;
- laptops;
- desktop monitors.

Important reference widths:

- 320px
- 375px
- 390px
- 430px
- 768px
- 1024px
- 1280px
- 1440px+

Horizontal scrolling caused by broken layout is unacceptable.

---

# 7. PRODUCT CATEGORIES

The store may include categories such as:

- Cabin Suitcases
- Medium Suitcases
- Large Suitcases
- Suitcase Sets
- Travel Bags
- Backpacks
- Accessories

Do not hard-code this list into application logic unless it matches the actual product database or project requirements.

Categories should ideally be data-driven.

---

# 8. PRODUCT DATA

A luggage product may contain:

- name;
- SKU;
- category;
- brand;
- price;
- old price;
- discount;
- stock status;
- images;
- description;
- dimensions;
- weight;
- volume;
- material;
- number of wheels;
- wheel type;
- lock type;
- TSA lock;
- expandable option;
- handle information;
- internal compartments;
- warranty;
- color;
- size;
- availability.

Not every field is mandatory for every product.

Inspect actual project data before changing the product model.

---

# 9. PRODUCT VARIANTS

A product may have variants such as:

- size;
- color;
- combination of size and color.

Variant architecture must avoid duplicated or contradictory product data.

If multiple sizes share the same model, consider whether they should be:

- separate products;
- variants of one product;
- related products.

Do not change the current model without first inspecting existing data and dependencies.

---

# 10. HOMEPAGE

The homepage should primarily help users:

- understand what the store sells;
- access the catalog;
- discover categories;
- see featured products;
- see promotions;
- build trust.

Possible sections:

- header;
- hero;
- categories;
- featured products;
- best sellers;
- new arrivals;
- promotional banner;
- advantages;
- reviews;
- brands;
- newsletter;
- footer.

Only keep sections that provide real value.

---

# 11. HEADER

The main header should support easy access to:

- logo;
- catalog;
- navigation;
- search;
- account;
- wishlist;
- cart.

Mobile navigation must be especially clear.

Avoid overly complicated mega menus unless the catalog requires them.

---

# 12. SEARCH

Search should eventually support relevant product discovery.

Possible searchable fields:

- product name;
- SKU;
- category;
- brand;
- keywords.

Search should not return fake results.

If live search is implemented, consider:

- debounce;
- loading state;
- empty state;
- keyboard accessibility;
- mobile UX.

---

# 13. CATALOG

The catalog should make it easy to find appropriate luggage.

Potential filters include:

- category;
- price;
- size;
- color;
- material;
- brand;
- volume;
- number of wheels;
- TSA lock;
- availability.

Possible sorting:

- newest;
- popularity;
- price ascending;
- price descending;
- discount.

All filters must correspond to actual product data.

---

# 14. PRODUCT CARD

A standard product card may include:

- image;
- product name;
- price;
- previous price;
- discount;
- availability;
- color variants;
- wishlist;
- add-to-cart action.

Cards should remain visually consistent regardless of product title length or image proportions.

---

# 15. PRODUCT PAGE

The product page is a key conversion page.

It should eventually contain:

- image gallery;
- thumbnails;
- title;
- price;
- old price / discount;
- availability;
- SKU;
- color;
- size;
- quantity;
- add to cart;
- wishlist;
- delivery information;
- payment information;
- return information;
- description;
- specifications;
- warranty;
- related products.

The exact structure must be based on existing functionality and product data.

---

# 16. CART

The cart should support:

- adding products;
- removing products;
- quantity changes;
- product variants;
- subtotal;
- discounts;
- delivery;
- total.

Server-side code must never trust price or total values supplied by the browser.

---

# 17. CHECKOUT

The checkout should be simple.

Possible customer information:

- first name;
- last name;
- phone;
- email;
- city;
- delivery method;
- address;
- pickup point;
- payment method;
- comment.

Only request data that is actually needed to fulfil the order.

---

# 18. ORDER SYSTEM

The desired order lifecycle may include:

- New
- Awaiting Payment
- Paid
- Processing
- Shipped
- Delivered
- Cancelled
- Returned

Actual statuses must be aligned with the existing database and business logic.

Avoid changing status names without checking dependencies.

---

# 19. PAYMENT ARCHITECTURE

Payments are security-critical.

Payment state must not depend only on a frontend redirect.

A successful payment should be verified through a trusted server-side mechanism.

Possible mechanisms:

- webhook;
- callback;
- provider API verification.

Important checks:

- correct order;
- correct amount;
- correct currency;
- transaction identifier;
- provider signature;
- duplicate callback protection.

Never store payment secrets in public code.

---

# 20. DELIVERY

The architecture should allow one or more delivery methods such as:

- courier delivery;
- delivery to address;
- pickup point;
- parcel office;
- local pickup.

Exact providers and integrations must be verified from the current project.

---

# 21. CUSTOMER ACCOUNT

Potential account functionality:

- registration;
- login;
- logout;
- password reset;
- profile editing;
- saved addresses;
- order history;
- order details;
- wishlist.

Do not assume these features already exist.

Always inspect the project first.

---

# 22. ADMIN PANEL

The project may need administration for:

- products;
- categories;
- prices;
- discounts;
- stock;
- orders;
- order statuses;
- users;
- banners;
- content.

Admin access must always be protected by backend authorization.

---

# 23. IMAGE SYSTEM

Product images are important for this project.

Requirements:

- consistent proportions;
- responsive rendering;
- optimized file size;
- no unnecessary quality loss;
- lazy loading where appropriate;
- descriptive alt text.

Prefer modern formats when supported:

- WebP
- AVIF

Original high-quality sources should be preserved where appropriate.

---

# 24. PERFORMANCE GOALS

The project should avoid:

- unnecessarily large images;
- duplicate JS libraries;
- large blocking scripts;
- unnecessary API requests;
- heavy animations;
- huge CSS bundles;
- layout shifts;
- slow product pages.

Performance improvements must not break functionality.

---

# 25. SECURITY GOALS

Security must be considered for every backend feature.

Important attack areas:

- SQL injection;
- XSS;
- CSRF;
- authentication;
- authorization;
- IDOR;
- file upload;
- session security;
- order manipulation;
- price manipulation;
- payment callbacks;
- admin access.

All external input should be considered untrusted.

---

# 26. PASSWORDS

Passwords must:

- never be stored in plain text;
- use secure password hashing;
- not be logged;
- not be exposed in API responses.

Password reset tokens should be secure, temporary and single-use where possible.

---

# 27. DATABASE SAFETY

Database-related changes should:

- preserve existing data;
- avoid unnecessary destructive operations;
- use parameterized queries / prepared statements;
- validate identifiers;
- use transactions when several dependent operations must succeed together.

Database schema changes must be explained before implementation.

---

# 28. SEO GOALS

Product and category pages should be suitable for search engines.

Consider:

- unique titles;
- descriptions;
- canonical URLs;
- semantic headings;
- structured product data;
- breadcrumbs;
- product availability;
- product prices;
- Open Graph;
- sitemap;
- robots.txt.

Do not add fake reviews or fake structured data.

---

# 29. ACCESSIBILITY GOALS

The project should move toward good accessibility.

Important areas:

- keyboard navigation;
- forms;
- labels;
- buttons;
- focus state;
- alt text;
- dialogs;
- headings;
- contrast;
- semantic HTML.

Accessibility should be integrated into normal development rather than treated as a final cosmetic task.

---

# 30. TESTING STRATEGY

Important customer journey to test:

Homepage  
→ Catalog  
→ Product  
→ Cart  
→ Checkout  
→ Order confirmation

If authentication exists:

Registration  
→ Login  
→ Account  
→ Orders

If payments exist:

Order  
→ Payment  
→ Provider confirmation  
→ Order status update

Testing should include:

- normal flow;
- invalid data;
- repeated submissions;
- unavailable products;
- mobile;
- desktop.

---

# 31. DEVELOPMENT PRIORITIES

Unless the user gives a different priority, generally address problems in this order:

1. Critical broken functionality
2. Security vulnerabilities
3. Order/payment problems
4. Cart/checkout problems
5. Mobile issues
6. Catalog/product UX
7. Account/admin functionality
8. Performance
9. Accessibility
10. SEO
11. Visual polish

---

# 32. CURRENT PROJECT STATUS

Verified by full code inspection and browser testing (Playwright + Chrome, widths 320–1440px) on 2026-10-02.

## Technology Stack

- Frontend: static multi-page site, plain HTML5 (6 pages), no framework.
- Backend: **none**. There is no server, API, or database.
- Database: none. Product data is a static file `src/assets/data.json` (20 products).
- Client storage: `localStorage` — `bestshop_cart`, `bestshop_orders`, `bestshop_customer`, `bestshop_reviews_<id>` (no login/session storage since Stage 4).
- **No real payment backend. Portfolio demo only.**
- CSS: SCSS (Dart Sass `^1.101.7`, legacy `@import` syntax — deprecated), compiled with `npm run build` to a single minified `dist/style.css` (~53 KB, committed to git; production output, no source map).
- Design system: tokens in `src/scss/abstracts/_variables.scss` (SCSS maps → CSS custom properties `--color-*`, `--text-*`, `--space-*`, `--radius-*`, `--shadow-*`), mixins in `_mixins.scss` (`respond()`, `text()`, `focus-ring`), base in `base/_reset.scss` + `base/_typography.scss`, container in `layouts/_container.scss`, buttons in `components/_buttons.scss`, forms in `components/_forms.scss`.
- JavaScript: vanilla ES5-style IIFE modules attached to `window.BestShop` (`paths`, `cart`, `products`, `renderCard`, `modal`), loaded as separate `<script defer>` files. No bundler.
- Build tools: `npm run dev` (sass --watch), `npm run build` (compressed CSS). No linters, no tests (`npm test` is a placeholder that fails).
- Hosting: README describes Netlify; no deploy config in the repo.
- Email / Payment / Delivery providers: none (all forms are demo-only).
- Fonts: Google Fonts — Montserrat 400/500/600/700 only, one `<link>` per page.
- Origin: EPAM JavaScript capstone project (`REQUIREMENTS.md`, Figma-based).

## Current Pages

- Homepage: `index.html` — hero, categories (live counts), Popular now (top 8 by `popularity`), two existing offers, New arrivals (`blocks` flag), static testimonials. Newsletter and the "Travel Suitcases" block were removed in Stage 3.
- Catalog (+ category via `?category=` query): `src/html/catalog.html`
- Product: `src/html/product-card.html?id=<ID>` (client-side rendered)
- Cart: `src/html/cart.html` ("Proceed to checkout" → checkout page)
- Checkout: `src/html/checkout.html`
- Order confirmation: `src/html/order-success.html?id=<orderId>`
- Guest account / My orders: `src/html/account.html`
- Order details: `src/html/order.html?id=<orderId>`
- About: `src/html/about.html`
- Contact: `src/html/contact.html`
- Login / Registration / Wishlist / Admin / 404: do not exist (the fake login modal was removed in Stage 4; the header account icon links to `account.html`)

Header and footer markup is duplicated in all 10 HTML files (identical apart from relative paths; regenerated from one template in Stage 2 — keep them in sync when editing).

## Product Data Model (data.json)

Fields: `id` (e.g. `SU001`), `name`, `price` (integer USD, 220–800), `imageUrl` (one image per product), `category`, `color`, `size`, `salesStatus` (bool), `rating`, `popularity`, `description`, `blocks` (homepage placement).

- Categories in data: `suitcases` (12), `kids' luggage` (4), `carry-ons` (2), `luggage sets` (2).
- Colors: red, blue, green, black, grey, yellow, pink. Sizes: S, M, L, XL, and the combined value `"S, M, XL"` (2 products).
- **Not in data:** old price / discount amount, stock, brand, SKU (other than `id`), material, dimensions, weight, volume, wheels, TSA, expandable, warranty, multiple images, variants.
- Categories such as Travel bags, Backpacks, Accessories do **not** exist in the data.

## Current Features

- Product catalog: IMPLEMENTED (20 products, JSON fetch with cache, skeleton loading, empty state with reset, error state; visible H1/breadcrumb/document title follow the active category/search).
- Search: PARTIAL — header search (desktop bar / inside the mobile menu) submits to `catalog.html?search=`; catalog sidebar search (name/category/color/id substring, 200 ms debounce, Enter with a single match opens the product). No live suggestions; brand/SKU fields don't exist in data.
- Filters: IMPLEMENTED for category, color (swatches), size (pills), sale; option counts; active-filter chips; state kept in URL; left sidebar on desktop, drawer ≤1024px with "Show N products". No price/brand/material/etc. filters yet.
- Sorting: IMPLEMENTED (price asc/desc, popularity, rating).
- Pagination: IMPLEMENTED (12 per page, prev/next, no reload).
- Product variants: NOT IMPLEMENTED (one color/size per product; the cart supports color/size keys).
- Product page: PARTIAL — one image, no gallery, no old price, no stock, specs table shows only data fields; reviews in localStorage; "You May Also Like" is random.
- Cart: IMPLEMENTED (localStorage stores only `{id, quantity, color, size}`; name/price/image always come from data.json; invalid or removed items are dropped; quantity 1–99; merge by id+color+size; clear with confirm; 10% discount over $3,000; cross-tab sync). Delivery is shown as "Calculated at checkout".
- Wishlist: NOT IMPLEMENTED.
- Registration: NOT IMPLEMENTED.
- Login: REMOVED in Stage 4 (it accepted any email/password — fake authentication).
- Password reset: NOT IMPLEMENTED.
- Checkout: IMPLEMENTED (demo) — separate page: contact, address, delivery method, payment method, inline validation, sticky summary; creates an order.
- Orders / order history: IMPLEMENTED (demo, this browser only) — confirmation page, guest account with order list, order details with status timeline.
- Payment: SIMULATED — card form is format-checked only; pay on delivery. No provider, no transaction.
- Delivery integration: NOT IMPLEMENTED.
- Customer emails: NOT IMPLEMENTED (contact form and newsletter are simulated).
- Admin: NOT IMPLEMENTED.
- SEO: PARTIAL — static title/description per page, one H1 per page, alt texts on products. No canonical, Open Graph, structured data, sitemap.xml, robots.txt. Product title/H1 set only by JavaScript.
- Responsive design: PARTIAL — no horizontal scroll and no header overlap on any page at 320–1440px (verified 2026-10-02); visual design itself is still the original template.
- Accessibility: PARTIAL — labels/aria on many controls, `prefers-reduced-motion` respected; modals and the filter drawer trap focus and return it on close.

## Security Notes (verified)

- No backend → no SQL injection / CSRF / IDOR / session surface exists today.
- Product and review data are rendered with `textContent` / DOM API (an XSS payload in a review was not executed).
- Cart prices are never read from `localStorage`; quantities are validated (integer 1–99). This is only a client-side safeguard — the future backend must recalculate everything server-side.
- Fake login removed (Stage 4).
- Checkout: card number / expiry / CVC / holder are read only inside the submit handler, have no `name` attribute and `autocomplete="off"`, are cleared after payment and are never stored, logged or sent (verified: not in localStorage, sessionStorage, console or any network request).
- Orders read from storage are normalized: unknown fields dropped, image URLs whitelisted to `src/assets/images/`, delivery price from code, totals recalculated from items; customer text is rendered with `textContent` only (XSS payload in a name was not executed).

## Performance Notes (verified)

- `src/assets/images` = 9.3 MB, JPG/PNG only (no WebP/AVIF). Largest: `contact-img.png` 946 KB, `contact-slider.jpg` 910 KB, `big-promo-img.jpg` 845 KB.
- 24 image files are not referenced anywhere.
- No `<img>` has `width`/`height` attributes (layout shift risk); only JS-rendered product cards use `loading="lazy"`.
- Fonts: fixed in Stage 2 (one request, Montserrat only).

---

# 33. KNOWN BUGS

## BUG-001

**Status:** Fixed (2026-10-02)
**Priority:** High
**Area:** Cart / Responsive

**Description:** Horizontal page scroll on the cart page at 768px (page width 1138px) and 1024px (1248px). "Continue Shopping", "Clear Shopping Cart" and the summary are pushed off-screen.

**Cause:** `.cart-bottom` / `.cart-buttons` layout in `src/scss/pages/_cart.scss` does not wrap at tablet widths.

**Fix:** Cart page uses a fixed 340px right column (actions stacked above the summary) on desktop, stacks below the items at ≤1024px and goes single-column at ≤700px. `min-width: 0` on the items column. Verified: no horizontal scroll at 320–1440px.

## BUG-002

**Status:** Fixed (2026-10-02)
**Priority:** High
**Area:** Login modal / Mobile

**Description:** At 320–390px the login form is wider than the modal and is clipped (labels and inputs cut off on the left).

**Cause:** Fixed widths (`.login-input`, `.login-btn`, `.password-wrapper` = 360px) in `src/scss/main.scss`.

**Fix:** Login modal is 440px max and all fields/button are `width: 100%`; password toggle repositioned with a 40px target. Verified at 320/375/390/430px.

## BUG-003

**Status:** Fixed (2026-10-02)
**Priority:** High
**Area:** Header / Mobile

**Description:** On phones the fixed header stacks into 4 rows (logo, hamburger, socials, account+cart) and is ~237px tall, permanently covering ~28% of the screen; page tops (e.g. the "My Cart" title) are partly hidden behind it. In the open mobile menu "Catalog" is misaligned.

**Cause:** `.topbar` is `position: fixed` with a wrapping flex layout in `src/scss/layouts/header.scss`.

**Fix:** Header is now `position: sticky` (body padding hacks removed). ≤768px: one 60px row — menu button | logo | account + cart (44px targets); social links are cloned into the mobile menu by main.js; categories listed inline in the menu. Also removed a global `header, nav {flex-direction: column}` rule in `_home.scss` that broke every `<nav>` on mobile. Tablet (769–1024px) keeps the desktop layout (128px) instead of the old 228px column layout.

## BUG-004

**Status:** Fixed (2026-10-02)
**Priority:** Medium
**Area:** Cart / Data integrity

**Description:** Cart trusts `price` and `quantity` stored in localStorage. A modified entry (price 1, quantity -5) produced Subtotal/Total "$-5" and header counter "-5". Prices are also never refreshed from `data.json`.

**Cause:** `getCart()` in `src/js/utils/storage.js` only checks that the value is an array.

**Fix:** `storage.js` stores only `{id, quantity, color, size}`, drops entries with non-integer/<1 quantity, invalid ids or bad JSON, merges duplicates, caps quantity at 99. `getCartLines()` joins items with data.json for name/price/image; `syncWithCatalog()` removes products that no longer exist or whose color/size don't match. Total is `max(0, …)`. If data.json fails to load the cart shows an error and hides checkout.

## BUG-005

**Status:** Fixed (2026-10-02)
**Priority:** Medium
**Area:** Cart / Layout

**Description:** In cart rows the product image overlaps the product name (seen at 768px and 390px).

**Cause:** Cart grid column sizing in `src/scss/pages/_cart.scss`.

**Fix:** Header and rows share one grid template; image is `width: 100%` of its column with a fixed aspect ratio.

## BUG-006

**Status:** Fixed (2026-10-02)
**Priority:** Low
**Area:** Product page

**Description:** The "(0 reviews)" text next to the rating never updates after reviews are added (the Reviews tab title does update).

**Cause:** `#reviewCountText` is not written by `src/js/product.js`.

**Fix:** `renderReviews()` updates `#reviewCountText`.

## BUG-007

**Status:** Fixed (2026-10-02)
**Priority:** Medium
**Area:** Accessibility / Modals

**Description:** Keyboard focus leaves open modals (login, checkout, confirm) after a few Tab presses; focus is not returned to the trigger on close.

**Cause:** `src/js/utils/modal.js` has no focus trap / focus restore.

**Fix:** `modal.js` traps Tab/Shift+Tab, focuses the first form field on open, returns focus to the trigger on close, sets `role=dialog`/`aria-modal`. The catalog filter drawer uses the same helpers and is `visibility: hidden` when closed.

## BUG-008

**Status:** Fixed (2026-10-02)
**Priority:** Low
**Area:** Mobile layout

**Description:** Product breadcrumbs stack vertically on phones; catalog "Filters" bar has no side padding (button touches the screen edge).

**Cause:** Missing mobile styles in `_product-details.scss` / `_catalog.scss`.

**Fix:** Root cause was the global `header, nav` rule (see BUG-003). Breadcrumbs wrap in a row; catalog container got 20px side padding; mobile filter controls are 44px high.

## BUG-009

**Status:** Fixed (2026-10-02)
**Priority:** Low
**Area:** Cart

**Description:** The header cart counter does not update in other open tabs.

**Cause:** No `storage` event listener.

**Fix:** `storage` event listener refreshes the counter and dispatches `bestshop:cartchange`; the cart page re-renders on it. `products.js` is now also loaded on About/Contact so every page drops removed products from the counter.

---

## BUG-010

**Status:** Fixed (2026-10-02, Stage 2)
**Priority:** High
**Area:** Forms (contact, checkout, reviews)

**Description:** Inline field error messages were never visible on the Contact form, the checkout modal and the review form; an empty checkout gave no feedback at all.

**Cause:** A global `.error { display: none }` rule in `_contact.scss`; only the login script set `display` explicitly.

**Fix:** `.error` is shown whenever it has text (`:empty` hides it) in `components/_forms.scss`; contact/checkout/review scripts also set `aria-invalid` so invalid fields get the error border.

---

## Minor issues found during Stage 1 (not fixed — out of scope)

- ~~Cart hero title wraps on phones~~ — fixed in Stage 2.
- ~~Scroll-reveal shift after an anchor jump~~ — reduced to 16px in Stage 2; `about.html#team` now lands exactly below the header.
- After removing a cart row or clearing the cart, keyboard focus falls back to `<body>`.
- ~~Menu button is a `<div>`~~ — real `<button>` since Stage 2.
- ~~Stale `dist/style.css.map` in git~~ — removed in Stage 2; `dist/*.map` is git-ignored (`npm run dev` still generates it locally).

## BUG-011

**Status:** Fixed (2026-10-03, Stage 3)
**Priority:** Critical
**Area:** Homepage / product links

**Description:** Every product link on the homepage returned 404 (`/product-card.html?id=…` at the site root).

**Cause:** `productUrl()` in `render-card.js` returned a path relative to the current page, which only worked from pages inside `src/html/`. Present since commit `6e4d60b`.

**Fix:** `productUrl()` builds an absolute URL from the site root via `paths.assetUrl()`; verified that all 11 homepage product links return 200.

---

## Minor issues found during Stage 2 (not fixed)

- ~~Product cards: two equal buttons, ★½ text rating, 1 column on phones~~ — redesigned in Stage 3.
- Product page layout, gallery and spec table are unchanged apart from shared components (Stage 4).
- Cart delete button still uses the 🗑️ emoji (Stage 5).
- Social links were removed from the footer in Stage 2: the old links pointed to generic facebook.com / twitter.com / instagram.com, not Best Shop accounts. Add them back only with confirmed official URLs.
- Field errors are not yet linked to inputs with `aria-describedby`.
- `big-promo-img.jpg` has grey blurred edges baked into the image.

## Data / asset issues found during Stage 3 (need real product data)

- 4 product photos are small squares (SU006 120px, KL016 120px, SET017 87px, SET018 116px) and look blurry when enlarged; the other 16 are 296×400.
- SU001 and SU008 use visually identical photos (red suitcase), so "Popular now" shows two look-alike cards.
- No luggage-set lifestyle photo exists; the Luggage Sets category card uses the 116px SET018 photo.
- `suitcase.png` (vintage leather case) and the `travel-suit-*.png` images are no longer used on the homepage.

---

# 34. DEVELOPMENT ROADMAP

Based on the 2026-10-02 audit.

## Stage 1 — Stabilization (no redesign) — DONE 2026-10-02

- Fixed BUG-001…BUG-009.

## Stage 2 — Design foundation + header — DONE 2026-10-02

- Design tokens, typography scale, container/spacing, button and form systems, new header with real search, new footer, BUG-010.

## Stage 3 — Homepage, catalog and product cards — DONE 2026-10-03

- Homepage restructure, catalog header/toolbar/filters/chips/empty state/skeletons, product card redesign, rating component, add-to-cart toast, BUG-011.

## Stage 4 (done instead of the product page) — Checkout, demo payment and orders — DONE 2026-10-05

- Checkout page, demo card / pay-on-delivery payment, order creation, confirmation page, guest account with order history, order details with status timeline; fake login removed.

## Stage 5 — Product data model + product page — NEXT

- Extend data.json only with real data (old price, stock, specs, multiple images) — requires product data from the owner.
- Gallery, specs, delivery/returns blocks, related products by category.

## Stage 6 — Cart page polish

- Cart layout refresh (the cart page still uses the Stage 1/2 table layout and the 🗑️ emoji); optional demo admin to change order statuses.

## Stage 7 — Backend (requires a decision)

- Real orders, authentication, account, order history, wishlist sync, admin, payments, server-side price validation.

## Stage 8 — Performance, SEO, accessibility

- Image optimization (WebP/AVIF, sizes, width/height), remove unused assets, meta/OG/canonical, sitemap/robots, Product schema (needs server/static rendering for product pages).

---

# 35. COMPLETED WORK

Maintain a concise list of significant completed tasks.

Format:

## YYYY-MM-DD — Task name

- what was changed;
- important technical decisions;
- testing performed;
- commit hash if applicable.

Do not document every tiny CSS adjustment.

Keep this section useful for future sessions.

## 2026-10-02 — Stage 1: stabilization

- Fixed BUG-001…BUG-009 (see section 33).
- Decision: header is `position: sticky` instead of `fixed` + body padding.
- Decision: cart storage holds only `{id, quantity, color, size}`; catalog data is the only source of price/name/image.
- Testing: Playwright + Chrome — 7 widths × 6 pages (horizontal scroll, header overlap, sticky, console), 62 scenario checks (cart tampering cases, two tabs, keyboard in modals/menu/drawer, checkout, reviews), regression of catalog filters/sort/search/pagination, contact form, legacy cart migration.
- Commit `1739f38`.

## 2026-10-02 — Stage 2: design system and visual refresh

- Tokens (`--color-*` roles, type scale, 4–96px spacing, radius sm/md/pill, two shadows), one 1200px container with 16/24px gutters, section spacing token.
- Typography: Montserrat 400–700 only; Nunito and the duplicate CSS `@import` removed; buttons/inputs inherit the font (they rendered in Arial before).
- Buttons: primary / secondary / ghost / icon + sm size, hover/focus-visible/active/disabled; legacy classes mapped with `@extend` (no JS selector changed).
- Forms: one field style (48px, 16px text, focus ring, error, disabled), checkbox/radio accent, visible inline errors (BUG-010), `aria-invalid` on invalid fields.
- Header: desktop `logo | Catalog▾ · About · Contact | search | account | cart` (72px); compact header ≤1024px with a real `<button>` menu (aria-expanded/controls), search and categories in the menu; dropdown also opens on keyboard focus; social links removed from the header.
- Footer: benefits band (text unchanged), brand, Shop (real categories), Company, Contact, Shipping, copyright; non-link items and unconfirmed social links removed.
- Marketing claims (discounts, free shipping, warranty, testimonials) intentionally unchanged.
- Testing: 64 scenario checks, 16 regression checks (incl. header search → catalog), 7 widths × 6 pages responsive + console, smoke test on production CSS.
- Commit `55287c7` (pushed to origin/main).

## 2026-10-03 — Stage 3: homepage, catalog and product cards

- Homepage: 10 sections → 6 (hero with the best existing photo + 1 primary/1 secondary CTA, category cards with product photos from each category and live counts, Popular now, compact offers with unchanged wording, New arrivals, simplified testimonials). Removed: Travel Suitcases (non-clickable, random taglines), duplicate benefits section (footer band remains), CMO persona block, newsletter (sent nothing). Page height 6180 → ~4740px desktop, 12000 → ~7060px at 390px.
- Product card: 3:4 image with `object-fit: contain` on a neutral surface, Sale badge only from `salesStatus`, 2-line clamped title, SVG-mask star rating with fractions, price, one "Add to cart" button; the title link is stretched over the card (one tab stop + the button).
- Add-to-cart feedback: button shows "Added", toast "Added to cart · View cart" in a polite live region (`src/js/utils/toast.js`).
- Catalog: breadcrumbs + H1 + count, toolbar (filters button, search, sort), chips, filters on the left with counts/swatches/size pills, skeleton cards, empty state, centered pagination; "Top Best Sets" removed (showed random suitcases).
- Grid decision (tested at 320/375/390/430): 2 columns on all phones ≤600px (card 138–193px wide, title 2 lines, button label on one line; icon hidden ≤359px), 3 columns on tablet/catalog desktop, 4 on homepage desktop.
- BUG-011 fixed (homepage product links 404).
- Testing: 30 new Stage 3 checks, 64 scenario + 16 regression checks, 7 widths × 6 pages responsive + console, smoke test, production build.
- Commit `aa56b72` (pushed to origin/main).

---

## 2026-10-05 — Stage 4: checkout, demo payment and orders

- New pages: checkout, order-success, account, order; new modules `utils/orders.js`, `utils/customer.js`, `utils/order-view.js`, `utils/format.js`; page scripts `checkout.js`, `order-success.js`, `account.js`, `order.js`; styles `components/_order.scss`, `pages/_checkout.scss`, `pages/_account.scss`.
- Cart: modal checkout (which only cleared the cart) replaced by "Proceed to checkout"; summary shows "Delivery: Calculated at checkout".
- Fake login modal and its code/styles removed; header account icon → `account.html` (all 10 pages).
- Validation: inline errors with `aria-invalid` + `aria-describedby`, form-level alert, focus on the first invalid field; errors update live after the first attempt; double-submit protection.
- Accessibility: success heading receives focus; status timeline uses `aria-current="step"` with visually hidden state text; radio groups in fieldsets with legends.
- Testing: 59 Stage 4 checks (cart→checkout, validation, card/COD orders, numbering, storage contents, account, order details, tampered storage, XSS, keyboard, two tabs), 30 + 16 Stage 3 checks, 57 scenario checks, 16 regression checks, 7 widths × 10 pages responsive + console, smoke 10 pages × 2 widths, production build.
- Committed and pushed to origin/main as `feat: add demo checkout, order flow and guest account` (see `git log`).

---

# 36. IMPORTANT DECISIONS

Record architecture or business decisions that Claude must not repeatedly reconsider.

Example:

## Decision 001 — Existing technology stack

**Decision:** Keep the existing stack.

**Reason:** Migration currently provides no clear business benefit.

**Date:** YYYY-MM-DD

## Decision 002 — Design tokens are the only source of visual values

**Decision:** New styles use `var(--color-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)` and the `text()` mixin; no new hard-coded colors. Brand rose `--color-primary` (#a8204f) is reserved for primary CTAs, sale badges, cart count and active/focus states.

**Date:** 2026-10-02

## Decision 003 — Compact header below 1024px

**Decision:** The hamburger header is used up to 1024px (`respond(tablet)`); `main.js` uses the same breakpoint to close the menu. The catalog filter drawer uses the same 1024px breakpoint.

**Date:** 2026-10-02

## Decision 004 — Two product cards per row on phones

**Decision:** Product grids use 2 columns at ≤600px, including 320px, after a real test at 320/375/390/430px.

**Date:** 2026-10-03

## Decision 005 — No newsletter without a backend

**Decision:** The newsletter form was removed because it sent nothing; add it back only with a real subscription service.

**Date:** 2026-10-03

## Decision 006 — Guest account instead of fake login

**Decision:** The header account icon links to `account.html`; the old login modal (any email/password accepted) was removed. Orders are a guest flow tied to this browser. Real authentication only with a backend.

**Date:** 2026-10-05

## Decision 007 — Demo checkout and order architecture

**Decision:**
- Checkout is a separate page; cart → `checkout.html` never clears the cart. The cart is cleared only after `orders.saveOrder()` succeeded.
- Order storage: `src/js/utils/orders.js` (`bestshop_orders`) — `getOrders()`, `getOrderById()`, `createOrder()`, `saveOrder()`, `normalizeOrder()`, `generateOrderNumber()`, `calculateTotals()`. This API is the seam a backend replaces later.
- Order shape: `{ id, orderNumber, createdAt, customer{firstName,lastName,email,phone}, shippingAddress{country,city,address,postalCode}, deliveryMethod, paymentMethod, paymentStatus, orderStatus, items[{id,name,price,quantity,color,size,imageUrl}], subtotal, discount, delivery, total, currency }`. Item prices are the snapshot at purchase time (from data.json); totals are always recalculated from items.
- Order number: `BS-<year>-<4+ digit sequence>` (e.g. BS-2026-0001), continuing from the highest stored number of that year; unique within this browser. `id` (URL) is a separate short random token.
- Order statuses: `received` (Order received) → `processing` → `shipped` → `delivered`. New orders start as `received`; there is no automatic progression (a demo admin may change it later).
- Payment statuses (separate from order status): `paid` (card demo) / `pay_on_delivery`.
- Delivery (demo rates, labelled in the UI): Standard — free, 2–5 business days (matches the existing site copy); Express — $25 "demo rate". Discount: existing 10% over $3,000 rule.
- Customer storage: `src/js/utils/customer.js` (`bestshop_customer`) — whitelisted contact/delivery fields only, saved when "Save my details" is checked, removed when unchecked.
- Demo payment rule: card fields are format-checked only (16 digits, MM/YY not expired, 3-digit CVC, holder name) and never stored/logged/sent. UI shows "Demo checkout. No real payment will be processed."

**Date:** 2026-10-05

---

# 37. OPEN QUESTIONS

- Will the store get a real backend (own API + database, or a headless commerce platform)? Real accounts, server-side orders, wishlist sync, admin and payments depend on it. Until then the project is a portfolio demo (Decision 006/007).
- Target market: currency (currently USD) and languages (currently English only) — the brief says "European store".
- Who provides real product data (specs, multiple photos, old prices, stock, brands)? Target categories (Travel bags, Backpacks, Accessories) do not exist in the data.
- Are the marketing claims real (25% / 50% discounts, free shipping over $150, lifetime warranty, testimonials, team)? The cart currently always shows "Shipping: Free".
- Brand accent: refined to #a8204f in Stage 2 — confirm or provide official brand colors/logo.
- Deployment target: Netlify (per README)?
- Official Best Shop social media URLs (none confirmed; footer currently has no social links).

---

# 38. RULE FOR UPDATING THIS DOCUMENT

Update `PROJECT_CONTEXT.md` when important project facts change.

Good reasons to update it:

- new integration;
- architecture change;
- payment provider chosen;
- database schema changed;
- important feature completed;
- major bug fixed;
- new project rule;
- new deployment architecture.

Do not fill this document with temporary debugging notes.

---

# 39. SOURCE OF TRUTH

When determining how the system actually works, use this priority:

1. Current verified code and database structure
2. Confirmed user instructions
3. `PROJECT_CONTEXT.md`
4. Assumptions

If an assumption is necessary, clearly mark it as an assumption.

Never silently invent project behavior.

---

# 40. CURRENT INITIAL TASK

The first task for this project is:

**Perform a complete audit of the existing Best Shop project before major modifications.**

Claude should inspect the existing project and then update this document with verified information about:

- technology stack;
- architecture;
- pages;
- existing features;
- missing functionality;
- major bugs;
- security risks;
- current development priorities.

Do not change large parts of the project before understanding how it currently works.