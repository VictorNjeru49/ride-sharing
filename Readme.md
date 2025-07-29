# 🚗 Fullstack Rideshare Booking App

A full-featured rideshare application enabling users to register as **riders** or **drivers**, book and manage rides, make secure payments, and receive AI-powered insights.

Built with:

- ⚙️ **NestJS** (Backend)
- 💻 **React + TypeScript** (Frontend)
- 🗄️ **PostgreSQL** (Database)
- 🤖 **OpenAI Integration** (AI Services)
- 💳 **Stripe** (Payments)

---

## 🌐 Technologies Used

### 🧠 Backend – [NestJS](https://nestjs.com/)

- **NestJS** – A progressive Node.js framework for building efficient server-side apps
- **PostgreSQL** – Robust, open-source relational database
- **Prisma ORM** – Type-safe database access layer
- **JWT Auth** – JSON Web Token-based authentication/authorization
- **Bcrypt** – For hashing user credentials securely
- **Redis (optional)** – Caching, rate-limiting, token storage
- **Swagger/OpenAPI** – Auto-generated API documentation
- **Stripe API** – For secure payment processing and payouts
- **Guards & Pipes** – Role-based access control and request validation

### 🎨 Frontend – [React](https://reactjs.org/)

- **React + TypeScript** – Strongly typed, modular frontend
- **Tailwind CSS + ShadCN UI** – Utility-first CSS and accessible UI components
- **TanStack Router** – Modern file-based routing for React
- **TanStack Query** – Asynchronous data fetching, caching & mutation management
- **Zod + React Hook Form** – Form handling with schema-based validation
- **Axios** – HTTP client for interacting with backend APIs

---

## 📦 Features Overview

### 🚘 Rider Features

- ✅ Register and log in as a rider
- ✅ Search and book available rides
- ✅ Select pickup and drop-off locations via map
- ✅ View assigned driver profile and vehicle details
- ✅ Real-time ride status and live location tracking
- ✅ View past rides and trip history
- ✅ Submit ride feedback and AI-assisted driver ratings
- ✅ Wallet system with transaction history
- ✅ Apply and redeem promo codes

### 🚖 Driver Features

- ✅ Register and log in as a driver
- ✅ Add or update vehicle information
- ✅ Accept, reject, and manage ride requests
- ✅ Update ride progress in real-time (Start → In-progress → Completed)
- ✅ View ride history and past earnings
- ✅ Monitor ratings and feedback

### ⚙️ Admin Panel

- ✅ Manage all users, drivers, and rides
- ✅ Create, activate, or deactivate promo codes
- ✅ Monitor platform payments and refund requests
- ✅ Resolve user disputes via ticket system (AI-assisted)
- ✅ Visualize app performance, usage, and trends

### 🤖 AI Features (OpenAI)

- 🧠 Intelligent feedback analysis for ride experiences
- ✍️ AI-generated summaries of completed rides
- 💬 Automated support for common issues
- 🔐 Detect anomalies in ride or payment behavior

---

## 🧭 System Architecture

```plaintext
┌────────────────────┐      HTTP + JSON       ┌──────────────────────┐
│   React Frontend   ├───────────────────────▶│   NestJS API Server   │
└────────┬───────────┘                        └────────┬─────────────┘
         │                                                  │
         │             Prisma ORM / REST                    │
         ▼                                                  ▼
   LocalStorage /                                     PostgreSQL DB
    TanStack Query                                      (Users, Rides,
   (for caching, sync)                                 Payments, Ratings)
