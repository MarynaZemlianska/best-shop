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
- Client storage: `localStorage` / `sessionStorage` (cart, demo login, reviews).
- CSS: SCSS (Dart Sass `^1.101.7`, legacy `@import` syntax — deprecated), compiled to a single `dist/style.css` (~53 KB, committed to git).
- JavaScript: vanilla ES5-style IIFE modules attached to `window.BestShop` (`paths`, `cart`, `products`, `renderCard`, `modal`), loaded as separate `<script defer>` files. No bundler.
- Build tools: `npm run dev` (sass --watch), `npm run build` (compressed CSS). No linters, no tests (`npm test` is a placeholder that fails).
- Hosting: README describes Netlify; no deploy config in the repo.
- Email / Payment / Delivery providers: none (all forms are demo-only).
- Fonts: Google Fonts (Montserrat; Nunito is also requested but not used).
- Origin: EPAM JavaScript capstone project (`REQUIREMENTS.md`, Figma-based).

## Current Pages

- Homepage: `index.html`
- Catalog (+ category via `?category=` query): `src/html/catalog.html`
- Product: `src/html/product-card.html?id=<ID>` (client-side rendered)
- Cart (+ checkout modal): `src/html/cart.html`
- About: `src/html/about.html`
- Contact: `src/html/contact.html`
- Login: modal in the header on every page (demo only)
- Registration / Account / Wishlist / Admin / Order confirmation page / 404: do not exist

Header and footer markup is duplicated in all 6 HTML files.

## Product Data Model (data.json)

Fields: `id` (e.g. `SU001`), `name`, `price` (integer USD, 220–800), `imageUrl` (one image per product), `category`, `color`, `size`, `salesStatus` (bool), `rating`, `popularity`, `description`, `blocks` (homepage placement).

- Categories in data: `suitcases` (12), `kids' luggage` (4), `carry-ons` (2), `luggage sets` (2).
- Colors: red, blue, green, black, grey, yellow, pink. Sizes: S, M, L, XL, and the combined value `"S, M, XL"` (2 products).
- **Not in data:** old price / discount amount, stock, brand, SKU (other than `id`), material, dimensions, weight, volume, wheels, TSA, expandable, warranty, multiple images, variants.
- Categories such as Travel bags, Backpacks, Accessories do **not** exist in the data.

## Current Features

- Product catalog: IMPLEMENTED (20 products, JSON fetch with cache, loading/error/empty states).
- Search: PARTIAL — catalog sidebar only (name/category/color/id substring, 200 ms debounce, Enter with a single match opens the product). No header search, no suggestions.
- Filters: IMPLEMENTED for category, color, size, sale; state kept in URL; mobile drawer exists. No price/brand/material/etc. (no data).
- Sorting: IMPLEMENTED (price asc/desc, popularity, rating).
- Pagination: IMPLEMENTED (12 per page, prev/next, no reload).
- Product variants: NOT IMPLEMENTED (one color/size per product; the cart supports color/size keys).
- Product page: PARTIAL — one image, no gallery, no old price, no stock, specs table shows only data fields; reviews in localStorage; "You May Also Like" is random.
- Cart: IMPLEMENTED (localStorage stores only `{id, quantity, color, size}`; name/price/image always come from data.json; invalid or removed items are dropped; quantity 1–99; merge by id+color+size; clear with confirm; 10% discount over $3,000; cross-tab sync). Shipping is always shown as "Free".
- Wishlist: NOT IMPLEMENTED.
- Registration: NOT IMPLEMENTED.
- Login: DEMO ONLY — any valid-looking email + any password "logs in"; only the email is stored.
- Password reset: NOT IMPLEMENTED.
- Checkout: DEMO ONLY — modal form (name, email, phone, country, city, address, comment); on submit clears the cart. No order is created.
- Orders / order history: NOT IMPLEMENTED.
- Payment: NOT IMPLEMENTED (payment logos are displayed on the product page).
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
- The demo login is not authentication and must not be presented as such in production.

## Performance Notes (verified)

- `src/assets/images` = 9.3 MB, JPG/PNG only (no WebP/AVIF). Largest: `contact-img.png` 946 KB, `contact-slider.jpg` 910 KB, `big-promo-img.jpg` 845 KB.
- 24 image files are not referenced anywhere.
- No `<img>` has `width`/`height` attributes (layout shift risk); only JS-rendered product cards use `loading="lazy"`.
- Montserrat is loaded twice (HTML `<link>` + CSS `@import`), Nunito is loaded but unused.

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

## Minor issues found during Stage 1 (not fixed — out of scope)

- Cart hero title "My Cart" wraps into two lines on phones (cosmetic).
- Scroll-reveal animation (`.reveal`, `translateY(24px)`) shifts sections after an anchor jump (e.g. `about.html#team` lands ~12px under the sticky header).
- After removing a cart row or clearing the cart, keyboard focus falls back to `<body>`.
- The menu button is a `<div>` with `role="button"` added by JS; it should be a real `<button>` (needs markup change in all 6 pages — Stage 2 header).
- `npm run build` outputs minified CSS without a source map, while the committed `dist/style.css` is the expanded `npm run dev` output with a map. Decide which one is committed.

---

# 34. DEVELOPMENT ROADMAP

Based on the 2026-10-02 audit.

## Stage 1 — Stabilization (no redesign) — DONE 2026-10-02

- Fixed BUG-001…BUG-009.

## Stage 2 — Design foundation + header

- Design tokens (one accent color, neutrals, spacing, radius, typography scale), unified buttons/forms.
- Remove duplicate/unused font loading.
- New header: logo, catalog, search, account, wishlist placeholder only if wishlist is built, cart; compact sticky mobile header.
- Decide how to stop duplicating header/footer in 6 files.

## Stage 3 — Catalog and product cards

- Card redesign (equal image ratio, clamped titles, price/sale/availability), catalog layout, mobile filter drawer, empty states.

## Stage 4 — Product data model + product page

- Extend data.json only with real data (old price, stock, specs, multiple images) — requires product data from the owner.
- Gallery, specs, delivery/returns blocks, related products by category.

## Stage 5 — Cart and checkout UX

- Cart layout (mobile first), checkout as a page with proper input types and validation.

## Stage 6 — Backend (requires a decision)

- Real orders, authentication, account, order history, wishlist sync, admin, payments, server-side price validation.

## Stage 7 — Performance, SEO, accessibility

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
- Not committed.

---

# 36. IMPORTANT DECISIONS

Record architecture or business decisions that Claude must not repeatedly reconsider.

Example:

## Decision 001 — Existing technology stack

**Decision:** Keep the existing stack.

**Reason:** Migration currently provides no clear business benefit.

**Date:** YYYY-MM-DD

---

# 37. OPEN QUESTIONS

- Will the store get a real backend (own API + database, or a headless commerce platform)? Account, orders, wishlist sync, admin and payments depend on it.
- Target market: currency (currently USD) and languages (currently English only) — the brief says "European store".
- Who provides real product data (specs, multiple photos, old prices, stock, brands)? Target categories (Travel bags, Backpacks, Accessories) do not exist in the data.
- Are the marketing claims real (25% / 50% discounts, free shipping over $150, lifetime warranty, testimonials, team)? The cart currently always shows "Shipping: Free".
- Keep the current brand accent color (#c41b66 pink)?
- Deployment target: Netlify (per README)?

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