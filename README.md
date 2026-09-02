# 🎓 Student Marketplace

A full-stack marketplace web application designed for students to **buy and sell products within their campus/community**.

Students can create accounts, list products, browse products from other users, search and filter products, purchase products, and manage their own product listings.

---

## ⚙️ Environment Variables

The backend requires the following environment variables:

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/studentMarketPlace

JWT_SECRET=your_jwt_secret

## 🚀 Features

### 👤 User Authentication

- User registration and login
- JWT-based authentication
- Protected routes
- Secure user-specific operations
- User session management

### 🛍️ Product Management

- Add new products
- Upload product images
- Edit products
- Delete products
- View product details
- View products posted by the logged-in user
- Mark products as sold
- Display seller information
- Prevent users from modifying other users' products

### 🔎 Search & Filtering

- Search products by title
- Filter products by category
- Pagination for product listings
- Sort products by latest added
- Sold products are hidden from the marketplace

### 🛒 Purchase Management

- Purchase available products
- View purchase history
- View purchased product details
- Display seller information
- Prevent sellers from purchasing their own products

### 🔐 Authorization

- Only authenticated users can perform protected operations
- Only the product owner can edit their product
- Only the product owner can delete their product
- JWT authentication middleware protects APIs
- Sellers cannot purchase their own products

---

## 🏗️ Project Architecture

```text
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      (Vite)         │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express.js API    │
                    │      (Node.js)      │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ Authentication      │
                    │ Middleware (JWT)    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │     Database        │
                    └─────────────────────┘
