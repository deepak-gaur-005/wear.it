# wear.it — Modern Fashion E-Commerce

> 🚀 **My First Full-Stack Project**: An end-to-end clothing e-commerce web application featuring modern editorial fashion design, atomic inventory management, and secure Razorpay payment processing.

---

## 💡 What I Learned & Implemented

Building this application from scratch helped me master core full-stack software engineering concepts:

- **Full-Stack Architecture:** Connecting a React 19 single-page application with a Node.js/Express REST API.
- **Global State Management:** Using modular Zustand stores for cart, wishlist, customer profile, and admin catalogs.
- **Authentication & Security:** Implementing Clerk authentication, backend JWT verification, role guards (Customer vs. Admin), and sliding-window rate limiting.
- **Payment Gateway Integration:** Handling Razorpay checkout sessions, server-side cryptographic HMAC-SHA256 signature verification, and raw-body webhooks.
- **Database Modeling & Data Integrity:** Designing Mongoose schemas in MongoDB, preserving historical order snapshots, and executing atomic stock decrements with automatic rollback on payment failure.
- **Cloud Media Uploads:** Configuring Multer buffer streams and Cloudinary for multi-image product and banner hosting.

---

## 🛠 Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, Zustand, React Router, Lucide Icons
- **Backend:** Node.js, Express 5, MongoDB, Mongoose
- **Authentication:** Clerk
- **Payments:** Razorpay (HMAC-SHA256 verification & webhooks)
- **Media Storage:** Cloudinary

---

## ✨ Features

- **Storefront:** 3-second auto-scrolling hero carousel, product search, multi-facet filtering (category, brand, color, size, price), vertical thumbnail gallery with image zoom, and verified customer reviews.
- **Cart & Wishlist:** Real-time arithmetic quantity validation, coupon redemption, stock limits, and wishlist sync.
- **Payments & Checkout:** Server-calculated pricing, Razorpay checkout, atomic stock decrements with rollback on payment failure, and order snapshots.
- **Admin Dashboard:** Revenue and order analytics, product CRUD with multi-image Cloudinary uploads, discount coupon engine, and order lifecycle management.

---

## 📁 Project Structure

```text
wear.it/
├── client/                               # Frontend Application (React 19 + Vite)
│   ├── public/                           # Static public assets
│   ├── src/
│   │   ├── assets/                       # Local icons, vectors, and media
│   │   ├── components/                   # UI and layout component modules
│   │   │   ├── admin/                    # Admin dashboards, forms, and dialogs
│   │   │   ├── auth/                     # Protected, public-only & role-guard wrappers
│   │   │   ├── common/                   # Shared UI components (loader, alerts)
│   │   │   ├── customer/                 # Customer-facing storefront components
│   │   │   │   ├── cart-and-checkout/    # Slide-out cart drawer and item line cards
│   │   │   │   ├── common/               # Desktop navbar, mobile navbar & footer
│   │   │   │   ├── home/                 # 3-second auto-scrolling hero carousel
│   │   │   │   ├── orders/               # Customer orders modal and timeline
│   │   │   │   ├── products/             # Cards, filters, details gallery, tabs & reviews
│   │   │   │   ├── profiles/             # Multi-address management dialog
│   │   │   │   └── wishlist/             # Wishlist drawer & toggle cards
│   │   │   ├── layout/                   # CustomerLayout and AdminLayout wrappers
│   │   │   └── ui/                       # Base UI / Tailwind primitives (button, dialog, etc.)
│   │   ├── features/                     # Domain-driven Zustand stores
│   │   │   ├── admin/                    # Admin stores (dashboard, orders, reviews)
│   │   │   ├── auth/                     # Authentication sync store
│   │   │   └── customer/                 # Stores (cart, checkout, wishlist, home, products)
│   │   ├── lib/                          # Axios API client, config & helper functions
│   │   ├── pages/                        # Route page views
│   │   │   ├── admin/                    # Dashboard, Products, Order, Promos, Reviews, Settings
│   │   │   ├── auth/                     # Sign-in and Sign-up pages
│   │   │   └── customer/                 # Home, collections, Collection-Details, Order-Success
│   │   ├── index.css                     # Tailwind CSS v4 design tokens and utilities
│   │   ├── main.jsx                      # React application bootstrap & Clerk provider
│   │   └── router.jsx                    # React Router configuration & route tree
│   ├── .env.example                      # Client environment template
│   ├── package.json
│   └── vite.config.js
│
├── server/                               # Backend API (Node.js + Express 5)
│   ├── src/
│   │   ├── db/                           # MongoDB connection handler
│   │   │   └── db.js
│   │   ├── middlewares/                  # Express middleware pipeline
│   │   │   ├── auth.middleware.js        # Clerk JWT authentication & role enforcement
│   │   │   ├── errorHandler.middleware.js# Centralized error handler
│   │   │   └── rateLimiter.middleware.js # Sliding-window endpoint rate limiter
│   │   ├── models/                       # Mongoose data schemas
│   │   │   ├── banner.model.js           # Promotional carousel banners
│   │   │   ├── cart.model.js             # Customer shopping cart
│   │   │   ├── category.model.js         # Apparel categories
│   │   │   ├── order.model.js            # Historical order snapshots & statuses
│   │   │   ├── product.model.js          # Clothing items, images, and variants
│   │   │   ├── promo.model.js            # Discount coupon codes
│   │   │   ├── review.model.js           # Verified customer product ratings
│   │   │   ├── user.model.js             # User profiles, addresses & reward points
│   │   │   └── wishlist.model.js         # Customer wishlist records
│   │   ├── routes/                       # Express router controllers
│   │   │   ├── admin/                    # Admin CRUD (products, orders, promos, settings)
│   │   │   ├── auth/                     # Clerk authentication sync endpoint
│   │   │   └── customer/                 # Customer catalog, cart, checkout, orders, reviews
│   │   ├── utils/                        # Shared utility modules
│   │   │   ├── ApiError.js               # Standardized error class
│   │   │   ├── ApiResponse.js            # Standardized API response envelope
│   │   │   ├── AsyncHandler.js           # Async route wrapper
│   │   │   ├── cloudinary.js             # Cloudinary upload streamifier configuration
│   │   │   ├── helper.js                 # Validation and input sanitization helpers
│   │   │   └── razorpay.js               # Razorpay instance initializer
│   │   ├── app.js                        # Express app config, CORS, routes & raw body webhook
│   │   └── server.js                     # Server listener entry point (Port 5000)
│   ├── .env.example                      # Backend environment template
│   └── package.json
│
├── LICENSE                               # MIT License
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- MongoDB (Local or Atlas)
- Accounts: Clerk, Cloudinary, Razorpay

---

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

*Server runs on `http://localhost:5000`.*

---

### 2. Frontend Setup

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

*Client runs on `http://localhost:5173`.*

---

## ⚙️ Environment Variables

### Backend (`server/.env`)

```env
PORT=5000
CORS_ORIGINS=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
ADMIN_EMAILS=admin@wearit.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

### Frontend (`client/.env`)

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_BACKEND_URL=http://localhost:5000
```

---

## 📜 Available Scripts

| Directory | Command | Description |
|---|---|---|
| `client/` | `npm run dev` | Start Vite development server |
| `client/` | `npm run build` | Build production bundle |
| `client/` | `npm run lint` | Run ESLint validation |
| `server/` | `npm run dev` | Start backend with Nodemon auto-reload |
| `server/` | `npm start` | Start backend in production |

---

## 📄 License

Distributed under the [MIT](LICENSE) License.  
Created with dedication by **[Deepak Gaur](mailto:deepakguar111@gmail.com)**.
