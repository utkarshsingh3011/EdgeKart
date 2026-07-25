<div align="center">

# ⚡ EdgeKart

### An Embedded Systems Marketplace built for Students, Makers & Engineers.

Not every electronics component store is designed for learning.

EdgeKart reimagines the experience by combining a modern shopping platform with an embedded systems catalogue focused on development boards, sensors, displays and prototyping hardware.

Built as a full-stack MERN application with secure authentication, MongoDB integration and a responsive user experience.

---

</div>

---

# Why I Built EdgeKart

As an Electronics & Communication Engineering student, I often found myself browsing multiple websites just to compare development boards, sensors and embedded hardware.

Most existing platforms focus only on selling products.

I wanted to build something different.

EdgeKart combines an e-commerce experience with an engineer-friendly catalogue that presents components clearly, highlights specifications, and keeps the buying experience simple.

The project also became an opportunity to strengthen my backend development skills by implementing authentication, REST APIs, MongoDB, state management and production-ready architecture.

---

# Highlights

✔ Secure JWT Authentication

✔ MongoDB Atlas Database

✔ RESTful Express APIs

✔ Responsive React + TypeScript Frontend

✔ Shopping Cart

✔ Wishlist

✔ Order History

✔ Product Search

✔ Category Filtering

✔ Admin Dashboard

✔ Protected Routes

✔ Modern Dark UI

✔ Production-ready Build

---

# Tech Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Context API
- Axios

## Backend

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcrypt

## Development

- Git
- GitHub
- Postman
- VS Code
- Lighthouse

---

# Application Architecture

```
React
│
├── Context API
│
├── Axios Services
│
▼

Express Server

│

├── Authentication

├── Products

├── Orders

├── Wishlist

├── Cart

│

▼

MongoDB Atlas
```

---

# Features

## Authentication

- User Registration
- Secure Login
- JWT Tokens
- Protected Routes
- Persistent Sessions

---

## Product Catalogue

- Browse Products
- Search Components
- Category Filters
- Featured Products
- Product Details

---

## Shopping

- Add to Cart
- Quantity Updates
- Remove Products
- Wishlist
- Order History

---

## Admin

- Dashboard
- Product Management
- User Management
- Orders Overview

---

# Folder Structure

```
EdgeKart

├── server/

│ ├── controllers/

│ ├── middleware/

│ ├── models/

│ ├── routes/

│ └── utils/

│

├── src/

│ ├── components/

│ ├── context/

│ ├── pages/

│ ├── services/

│ └── assets/

│

└── public/
```

---

# Getting Started

Clone the repository

```bash
git clone https://github.com/utkarshsingh3011/EdgeKart.git
```

Install dependencies

```bash
npm install
```

Backend

```bash
cd server
npm install
npm run dev
```

Frontend

```bash
npm run dev
```

---

# Environment Variables

Create

```
server/.env
```

```env
PORT=

MONGO_URI=

JWT_SECRET=
```

---

# API Overview

## Authentication

```
POST /api/auth/register

POST /api/auth/login

GET /api/auth/profile
```

---

## Products

```
GET /api/products

GET /api/products/:id
```

---

## Cart

```
GET /api/cart

POST /api/cart

DELETE /api/cart/:id
```

---

## Wishlist

```
GET /api/wishlist

POST /api/wishlist
```

---

## Orders

```
GET /api/orders

POST /api/orders
```

---

# Screenshots

| Home | Products |
|-------|----------|
| screenshot | screenshot |

| Product | Cart |
|----------|------|
| screenshot | screenshot |

| Wishlist | Orders |
|-----------|--------|
| screenshot | screenshot |

---

# What I Learned

Building EdgeKart helped me understand that a modern application is much more than a polished interface.

Some of the biggest lessons came from solving practical backend problems such as authentication, API design, state synchronization between the frontend and MongoDB, protected routes, and managing application state across multiple pages.

It also reinforced the importance of writing maintainable code, organizing project structure, and thinking about how users actually interact with a product.

---

# Future Improvements

- Payment Gateway Integration
- Product Reviews
- Inventory Management
- Email Notifications
- Image Uploads
- Admin Analytics
- Product Recommendations

---

# Author

**Utkarsh Singh**

B.Tech Electronics & Communication Engineering

Jaypee Institute of Information Technology (JIIT), Noida

---

If you found this project interesting, feel free to ⭐ the repository.
