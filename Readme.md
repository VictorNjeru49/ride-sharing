# 🚗 Fullstack Rideshare Booking App

A full-featured rideshare application where users can register as **riders** or **drivers**, request and accept rides, handle payments, and receive real-time notifications.

Built with:

- ⚙️ **NestJS** (Backend)
- 💻 **React + TypeScript** (Frontend)
- 🗄️ **PostgreSQL** (Database)
- 🤖 **AI Integration** (OpenAI)
- 💳 **Stripe** (Payments)

---

## 🌐 Technologies Used

### 🧠 Backend – NestJS

- **NestJS** — Scalable Node.js framework
- **PostgreSQL** — Relational database
- **Prisma ORM** — Database access
- **JWT** — Authentication & authorization
- **Bcrypt** — Secure password hashing
- **Redis** _(optional)_ — Token management, caching
- **Swagger** — Auto-generated API docs
- t**Stripe API** – Payments
- **ValidationPipe** & **Guards** — Role-based access and input validation

### 🎨 Frontend – React

- **React + TypeScript**
- **Tailwind CSS + ShadCN UI** — Modern UI components
- **TanStack Router** — File-based routing
- **TanStack Query** — Server state management
- **Zod + React Hook Form** — Schema validation
- **Axios** — API communication

---

## 📦 Features Overview

### 🚘 Rider Features

- ✅ Sign up / Login
- ✅ Request a ride (select pickup/drop location)
- ✅ See available drivers
- ✅ Live ride tracking
- ✅ View ride history
- ✅ Rate drivers (AI suggestions)
- ✅ Wallet balance, transactions & promo code usage


### 🚖 Driver Features

- ✅ Register/Login as a driver
- ✅ Add/update vehicle details
- ✅ Accept/reject rides
- ✅ Live ride status updates
- ✅ Ride earnings dashboard
- ✅ View ratings & history


### ⚙️ Admin Features

- ✅ View/manage users, drivers, rides
- ✅ Issue & manage promo codes
- ✅ View all payments & refunds
- ✅ Resolve disputes and support tickets (AI-assisted)
- ✅ Monitor system analytics


### 🤖 AI Integration

- 🎯 Auto-resolve simple support queries (OpenAI)
- 🧠 Suggest driver ratings based on ride behavior
- 🛑 Detect fraud or unusual ride/payment activity
- ✨ Smart ride summaries after completion


---

## 🧭 App Architecture

```plaintext
[React Client]
    |
    |  (Axios HTTP Requests)
    ↓
[NestJS Backend Server]
    |
    |  (Prisma ORM)
    ↓
[PostgreSQL Database]

```
