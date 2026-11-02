# wear.it — Elevated Modern Fashion E-Commerce

<div align="center">

![wear.it Banner](https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop)

**A full-stack, production-ready clothing e-commerce platform built for modern fashion retail.**  
*Editorial aesthetics, dependable payments, atomic stock management, and complete customer/admin workflows.*

[![Node.js](https://img.shields.io/badge/Node.js-v20+-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.2-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-v19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_v9-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6C47FF?style=flat-square&logo=clerk&logoColor=white)](https://clerk.com/)
[![Razorpay](https://img.shields.io/badge/Payments-Razorpay-0C2340?style=flat-square&logo=razorpay&logoColor=white)](https://razorpay.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Key Features](#-key-features)
  - [Customer Experience](#customer-experience)
  - [Checkout & Payments](#checkout--payments)
  - [Admin Backoffice](#admin-backoffice)
  - [Security & Data Integrity](#security--data-integrity)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Configuration](#-environment-configuration)
- [API Reference](#-api-reference)
  - [Customer Endpoints](#customer-endpoints)
  - [Admin Endpoints](#admin-endpoints)
- [Design System & UI/UX](#-design-system--uiux)
- [Build & Code Quality](#-build--code-quality)
- [License](#-license)

---

## 🌟 Overview

**`wear.it`** is a full-featured e-commerce web application engineered from the ground up for contemporary apparel brands. It marries high-end editorial fashion design with a robust, scalable backend architecture:

- **True E-Commerce Workflows:** Real inventory limits, historical order snapshots, multi-color/multi-size variant selection, verified customer reviews, coupon redemption, and loyalty points.
- **Resilient Financial Transactions:** Server-authoritative price calculation, atomic stock decrement with rollback, HMAC-SHA256 signature verification, and asynchronous Razorpay webhooks.
- **Enterprise-Grade Admin Panel:** Real-time analytics dashboard, full catalog management with Cloudinary image uploads, coupon engines, order dispatch/cancellation management with inventory reconciliation, and review moderation.

---

## 🛠 Architecture & Tech Stack

```mermaid
graph LR
    Client[React 19 + Vite + Tailwind v4] -->|Axios + Zustand| API[Express 5 REST API]
    API -->|Mongoose ODM| DB[(MongoDB)]
    API -->|Auth Verification| Clerk[Clerk Auth]
    API -->|Payment Verification & Webhooks| Razorpay[Razorpay Gateway]
    API -->|Image Uploads & Storage| Cloudinary[Cloudinary CDN]
```

### Frontend
- **Framework:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **State Management:** [Zustand v5](https://github.com/pmndrs/zustand) (Modular stores for Cart, Wishlist, Profile, Orders, Products, Admin)
- **Styling & Tokens:** [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite`
- **Component Primitives:** [Base UI](https://base-ui.com/) + [Shadcn UI](https://ui.shadcn.com/) patterns
- **Typography & Icons:** [Inter Variable](https://fontsource.org/fonts/inter) + [Lucide Icons](https://lucide.dev/)
- **Feedback & Notifications:** [Sonner](https://sonner.emilkowal.ski/) toast notifications

### Backend
- **Runtime & Framework:** [Node.js](https://nodejs.org/) (ES Modules) + [Express 5](https://expressjs.com/)
- **Database & Modeling:** [MongoDB](https://www.mongodb.com/) with [Mongoose v9](https://mongoosejs.com/)
- **Authentication:** [Clerk SDK](https://clerk.com/) (`@clerk/express`) with role-based access control
- **Validation:** [Zod](https://zod.dev/) schemas + custom boundary sanitizers
- **Media Ingestion:** [Multer](https://github.com/expressjs/multer) (in-memory buffer with MIME and size constraints) + [Cloudinary](https://cloudinary.com/) streamifier
- **Payments:** [Razorpay Node SDK](https://razorpay.com/docs/) + crypto HMAC-SHA256 signature verification
- **Rate Limiting:** Sliding-window in-memory rate limiter on sensitive endpoints (`/checkout`, `/promos`, `/auth`)

---

## ⚡ Key Features

### Customer Experience
- **Auto-Scrolling Editorial Banner Carousel:** 3-second cycle, touch swipe on mobile, manual left/right frosted controls, and pagination indicators.
- **Comprehensive Product Catalog:**
  - Real-time search across title, brand, and description.
  - Multi-facet filtering by category, brand, color, size, and price range.
  - Sorting by recent, price (low-to-high / high-to-low), and discount percentage.
- **Rich Product Details Page:**
  - Vertical gallery thumbnail strip with active rings and zoom dialog.
  - Circular color swatches, dynamic stock badges ("Only 3 left in stock"), and interactive Size Guide modal.
  - 2-column tabbed section (Details, Materials & Care, Size & Fit, Shipping & Returns) paired with editorial macro fabric detail imagery.
  - "You May Also Like" recommendation strip.
- **Shopping Cart & Drawer:** Slide-out interactive drawer with numeric quantity validation, stock limit capping, coupon discount redemption, and real-time subtotal calculation.
- **Wishlist:** One-click save/remove with local store sync and dedicated dialog.
- **Address & Profile Management:** Multi-address book management with default selection flags.
- **Verified Customer Reviews:** Ratings (1-5 stars) and review submissions with purchase verification badge.

### Checkout & Payments
- **Zero Client-Price Trust:** Order totals, discounts, taxes, and delivery charges are calculated strictly on the server against database models.
- **Razorpay Integration:** Complete flow from order creation to client checkout dialog to server signature verification (`razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature`).
- **Atomic Stock Decrement & Rollback:** Decrements stock atomically when an order is created. If payment verification fails, inventory is restored immediately.
- **Asynchronous Webhook Processing:** Raw-body capture for `/customer/checkout/webhook` to handle payment authorizations and edge-case dropoffs idempotently.
- **Historical Snapshots:** Orders capture snapshot copies of product titles, images, unit prices, selected sizes, and colors to preserve accuracy even if catalog items change later.
- **Loyalty Points Checkout:** Alternative checkout route enabling registered customers to redeem accumulated points.

### Admin Backoffice
- **Operational Dashboard:** High-level metrics for revenue, total orders, active customers, catalog size, and recent activity feeds.
- **Product Management:** Full CRUD interface supporting multi-image Cloudinary uploads, primary cover selection, size/color variant arrays, and stock tracking.
- **Promotions & Promo Codes:** Create percentage-based discount codes with expiry dates, minimum order thresholds, and usage counters.
- **Order Processing:** Filter orders by status (`pending`, `confirmed`, `shipped`, `delivered`, `cancelled`, `returned`), view customer address snapshots, execute safe status transitions, and automatically restore stock upon cancellation.
- **Review Moderation:** Approve, hide, or moderate customer-submitted reviews.
- **Store Settings & Banners:** Upload and manage promotional banners rendered on the storefront carousel.

### Security & Data Integrity
- Server-side role enforcement validating admin status against `ADMIN_EMAILS` environment configuration.
- Strict Multer configuration enforcing 5MB image limits and verifying MIME types (`image/jpeg`, `image/png`, `image/webp`, `image/avif`).
- Centralized error handling intercepting Mongoose `CastError` and `ValidationError` without exposing stack traces in production.
- Sensitive authentication sync sanitizes personal identifiable information from terminal logs.

---

## 📂 Project Directory Structure

```text
wear.it/
├── client/                               # Frontend React + Vite Application
│   ├── public/                           # Static assets
│   ├── src/
│   │   ├── assets/                       # Brand icons and local assets
│   │   ├── components/                   # Reusable UI components
│   │   │   ├── admin/                    # Admin components (tables, dialogs, sidebars)
│   │   │   ├── auth/                     # Protected & Role-guarded layout wrappers
│   │   │   ├── common/                   # Shared UI loaders & badges
│   │   │   ├── customer/                 # Customer-facing components
│   │   │   │   ├── cart-and-checkout/    # Cart drawer and line items
│   │   │   │   ├── common/               # Customer navbar & editorial footer
│   │   │   │   ├── home/                 # 3-second auto-scroll banner carousel
│   │   │   │   ├── orders/               # Customer orders modal & tracking
│   │   │   │   ├── products/             # Product cards, filters, and gallery
│   │   │   │   ├── profiles/             # Address & profile modal
│   │   │   │   └── wishlist/             # Wishlist drawer & cards
│   │   │   ├── layout/                   # CustomerLayout & AdminLayout
│   │   │   └── ui/                       # Base UI / Tailwind component primitives
│   │   ├── features/                     # Domain-driven Zustand stores
│   │   │   ├── admin/                    # Admin stores (dashboard, orders, reviews)
│   │   │   ├── auth/                     # Auth bootstrap & user sync
│   │   │   └── customer/                 # Cart, checkout, wishlist, home, products
│   │   ├── lib/                          # Axios API client & utility helpers
│   │   ├── pages/                        # Route page views
│   │   │   ├── admin/                    # Dashboard, Products, Orders, Promos, Settings
│   │   │   ├── auth/                     # Sign-in and Sign-up
│   │   │   └── customer/                 # Home, Collections, Product Details, Success
│   │   ├── index.css                     # Tailwind CSS v4 design tokens & theme layers
│   │   ├── main.jsx                      # Application entry & provider trees
│   │   └── router.jsx                    # React Router configuration
│   ├── package.json
│   └── vite.config.js
│
├── server/                               # Backend Express API
│   ├── src/
│   │   ├── db/                           # MongoDB connection handler
│   │   ├── middlewares/                  # Auth, rate-limiter, error & Multer filters
│   │   ├── models/                       # Mongoose Schemas (User, Product, Order, etc.)
│   │   ├── routes/
│   │   │   ├── admin/                    # Admin controllers & routes
│   │   │   ├── auth/                     # Clerk authentication synchronization
│   │   │   └── customer/                 # Storefront catalog, cart, checkout, orders
│   │   ├── utils/                        # Cloudinary, Razorpay, ApiError, ApiResponse
│   │   ├── app.js                        # Express app configuration & middleware pipeline
│   │   └── server.js                     # Server listener entry point (Port 5000)
│   └── package.json
│
├── .env.example                          # Environment template reference
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v20.0.0 or higher
- **Package Manager:** `npm` (v10+)
- **MongoDB:** Local MongoDB instance or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **Accounts:**
  - [Clerk](https://clerk.com/) for authentication
  - [Cloudinary](https://cloudinary.com/) for product image storage
  - [Razorpay](https://razorpay.com/) for payment processing

---

### 1. Clone Repository

```bash
git clone https://github.com/your-username/wear.it.git
cd wear.it
```

---

### 2. Backend Setup

1. Navigate to the `server` directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create your `.env` file from the provided example:
   ```bash
   cp .env.example .env
   ```

3. Populate `server/.env` with your API credentials (see [Environment Configuration](#-environment-configuration)).

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start on `http://localhost:5000`.*

---

### 3. Frontend Setup

1. Open a new terminal tab, navigate to the `client` directory, and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Create your `.env` file from the provided example:
   ```bash
   cp .env.example .env
   ```

3. Populate `client/.env` with your Clerk publishable key:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
   VITE_BACKEND_URL=http://localhost:5000
   ```

4. Start the client development server:
   ```bash
   npm run dev
   ```
   *The application will open on `http://localhost:5173`.*

---

## ⚙️ Environment Configuration

### Backend (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port for Express server | `5000` |
| `CORS_ORIGINS` | Permitted client origins (comma-separated) | `http://localhost:5173` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `CLERK_PUBLISHABLE_KEY` | Clerk Publishable Key | `pk_test_xxxxxxxx` |
| `CLERK_SECRET_KEY` | Clerk Secret Key | `your_clerk_secret_key` |
| `ADMIN_EMAILS` | Comma-separated emails granted admin role | `admin@wearit.com,team@wearit.com` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud account name | `wearit-media` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `xxxxxxxxxxxxxxxxxxxxxxxx` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_xxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `xxxxxxxxxxxxxxxxxxxx` |
| `RAZORPAY_WEBHOOK_SECRET`| Razorpay Webhook Secret for signature validation | `xxxxxxxxxxxxxxxxxxxx` |

### Frontend (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk frontend publishable key | `pk_test_xxxxxxxx` |
| `VITE_BACKEND_URL` | Base URL of the running Express server | `http://localhost:5000` |

---

## 📡 API Reference

### Customer Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/customer/home` | Fetch homepage banners, categories, coupons & recent products | No |
| `GET` | `/customer/categories` | List active categories | No |
| `GET` | `/customer/products` | Query products with filters, search, sorting & pagination | No |
| `GET` | `/customer/products/facets` | Fetch distinct brands and colors available in catalog | No |
| `GET` | `/customer/products/:id` | Fetch detailed single product info | No |
| `GET` | `/customer/reviews/:productId` | Fetch verified reviews for product | No |
| `POST` | `/customer/reviews` | Submit new verified rating and review | **Yes** |
| `GET` | `/customer/cart` | Get current customer's shopping cart | **Yes** |
| `POST` | `/customer/cart` | Add product variant to cart | **Yes** |
| `PUT` | `/customer/cart` | Update item quantity in cart | **Yes** |
| `DELETE`| `/customer/cart/:id` | Remove line item from cart | **Yes** |
| `GET` | `/customer/wishlist` | Fetch customer wishlist items | **Yes** |
| `POST` | `/customer/wishlist/toggle` | Toggle item in wishlist | **Yes** |
| `GET` | `/customer/addresses` | Fetch saved delivery addresses | **Yes** |
| `POST` | `/customer/addresses` | Create new delivery address | **Yes** |
| `PUT` | `/customer/addresses/:id` | Update address details | **Yes** |
| `DELETE`| `/customer/addresses/:id` | Remove address | **Yes** |
| `POST` | `/customer/promos/apply` | Validate and apply promo discount code | **Yes** |
| `POST` | `/customer/checkout/create-session` | Initialize Razorpay order & reserve stock | **Yes** |
| `POST` | `/customer/checkout/verify` | Verify HMAC payment signature and finalize order | **Yes** |
| `POST` | `/customer/checkout/webhook` | Asynchronous Razorpay event webhook receiver | No (HMAC verified) |
| `POST` | `/customer/checkout/points` | Process points-based order checkout | **Yes** |
| `GET` | `/customer/orders` | Fetch customer order history with item snapshots | **Yes** |
| `POST` | `/customer/orders/:id/cancel` | Cancel order & restore inventory | **Yes** |

### Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|:---:|
| `GET` | `/admin/dashboard` | Aggregated analytics (revenue, order counts, users) | **Admin** |
| `GET` | `/admin/products` | Fetch all products across inventory | **Admin** |
| `POST` | `/admin/products` | Upload images to Cloudinary & create product | **Admin** |
| `PUT` | `/admin/products/:id` | Edit product metadata, variants, or image gallery | **Admin** |
| `DELETE`| `/admin/products/:id` | Delete product from database and Cloudinary | **Admin** |
| `GET` | `/admin/orders` | List customer orders with snapshot details | **Admin** |
| `PUT` | `/admin/orders/:id/status` | Update order dispatch/delivery status | **Admin** |
| `GET` | `/admin/promos` | Manage active and upcoming discount coupons | **Admin** |
| `POST` | `/admin/promos` | Create new promotion code | **Admin** |
| `GET` | `/admin/reviews` | View all customer reviews for moderation | **Admin** |
| `PUT` | `/admin/reviews/:id/status`| Approve, reject, or hide review | **Admin** |
| `GET` | `/admin/settings/banners` | Fetch storefront promotional banners | **Admin** |
| `POST` | `/admin/settings/banners` | Upload banner asset to Cloudinary | **Admin** |
| `DELETE`| `/admin/settings/banners/:id` | Delete promotional banner | **Admin** |

---

## 🎨 Design System & UI/UX

`wear.it` is styled with an editorial, minimalist aesthetic:
- **Palette:** High-contrast neutral palette (`white`, `black`, `slate-900`) with refined accent tokens.
- **Micro-Interactions:** Restrained transitions, hover zoom transforms, floating badges, and smooth slide drawers.
- **Form Controls:** Rounded buttons (`rounded-xl`), pill tags (`rounded-full`), and subtle borders (`border-border/60`).
- **Responsive Layout:** Unified `max-w-7xl` container grid from top announcement bar to footer, ensuring pixel alignment across all viewport sizes.

---

## 🧪 Build & Code Quality

Verify the application codebase:

```bash
# Check code style and React conventions
npm --prefix client run lint

# Build client for production (Vite)
npm --prefix client run build

# Validate server syntax
node -c server/src/app.js server/src/server.js
```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

<div align="center">
  <sub>Built with care for <b>wear.it</b> — Modern Apparel Commerce</sub>
</div>
