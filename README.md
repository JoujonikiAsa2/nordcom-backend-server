# NordCom E-commerce Backend API

A robust e-commerce REST API built with Node.js, Express.js, PostgreSQL, Prisma and TypeScript.
**Base URL:** `https://nordcom-backend-server.vercel.app/api/v1`

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **PostgreSQL** - Database
- **Prisma** - ORM for database operations
- **TypeScript** - Programming language
- **JSON Web Token** - Authentication

## Features

- 👤 User authentication and authorization
- 🛍️ Product management with categories and brands
- 🛒 Shopping cart functionality
- 📦 Order processing and management
- 💳 Payment integration
- 🚚 Shipping management
- ⭐ Product reviews and ratings
- ❤️ Favorites/Wishlist
- 🎫 Coupon system
- 📧 Newsletter subscription

## Database Schema

The project uses Prisma with PostgreSQL and includes models for:

- Users & User Extensions
- Products & Categories
- Orders & Cart
- Payments & Shipping
- Coupons & Reviews
- Brands & Favorites

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm/yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/nordcom-backend.git
```

## API Endpoints

### 🛡️ Auth Routes (`/auth`)
- `POST /auth/login` – User login
- `PATCH /auth/forgot-password` – Forgot password
- `PATCH /auth/reset-password` – Reset password

### 👤 User Routes (`/user`)
- `POST /user/register` – Register user
- `PATCH /user/update` – Update profile
- `GET /user/my-profile` – Logged-in user profile
- `GET /user/admin` – Admin profile
- `GET /user/` – Get all users
- `GET /user/:id` – Get user by ID

### 🧑‍💼 Admin Management (`/admin`)
- `GET /admin/users` – Get all users (admin only)
- `GET /admin/analytics` – Fetch analytics data
- `PATCH /admin/:id` – Change user status

### 🏷️ Category Routes (`/category`)
- `GET /category/` – Get all categories
- `POST /category/` – Create category
- `PATCH /category/update/:id` – Update category
- `DELETE /category/delete/:id` – Delete category
- `GET /category/:id` – Get category by ID

### 🏢 Brand Routes (`/brand`)
- `GET /brand/` – Get all brands
- `POST /brand/` – Create brand
- `PATCH /brand/update/:id` – Update brand
- `DELETE /brand/delete/:id` – Delete brand
- `GET /brand/:id` – Get brand by ID

### 🛍️ Product Routes (`/product`)
- `GET /product/` – Get all products
- `POST /product/` – Create product
- `PATCH /product/update/:id` – Update product
- `DELETE /product/delete/:id` – Delete product
- `GET /product/:id` – Get product by ID
- `GET /product/view/popular-product` – Popular products

### 🛒 Cart Routes (`/cart`)
- `POST /cart/add` – Add to cart
- `DELETE /cart/remove/:id` – Remove item from cart
- `DELETE /cart/remove-cart/:id` – Clear cart
- `GET /cart/` – Get cart for current user

### 📦 Order Routes (`/order`)
- `POST /order/create` – Create order
- `GET /order/` – Get all orders
- `PATCH /order/status/:id` – Change order status
- `GET /order/my-orders` – Get my orders
- `GET /order/:id` – Get order by ID

### 💳 Payment Routes (`/payment`)
- `POST /payment/create-checkout-session` – Create checkout session
- `POST /payment/create` – Create payment
- `GET /payment/` – Get all payments
- `GET /payment/:id` – Get payment by ID
- `GET /payment/my-payments/:email` – Get my payments
- `GET /payment/transId/:transId` – Get by transaction ID

### 🎁 Coupon Routes (`/coupon`)
- `GET /coupon/` – Get all coupons
- `POST /coupon/add` – Create coupon
- `PATCH /coupon/update/:id` – Update coupon
- `DELETE /coupon/delete/:id` – Delete coupon
- `GET /coupon/:id` – Get coupon by ID

### ❤️ Favorite Product Routes (`/favorite-product`)
- `GET /favorite-product/` – Get all favorite products
- `POST /favorite-product/` – Add favorite
- `DELETE /favorite-product/delete/:id` – Remove favorite
- `GET /favorite-product/:userId` – Favorites by user

### 📰 Newsletter Routes (`/newsletter`)
- `GET /newsletter/` – Get all newsletters
- `POST /newsletter/` – Add newsletter
- `DELETE /newsletter/delete/:id` – Delete by ID
- `GET /newsletter/:email` – Get by email
