# 🚗 Fullstack Rideshare Booking App

A full-featured rideshare application where users can register as **riders** or **drivers**, request and accept rides, handle payments, and receive real-time notifications. Built with **React + TypeScript (frontend)** and **NestJS (backend)** using PostgreSQL.

---

## 🌐 Technologies Used

### 🧠 Backend – NestJS
- **NestJS** — Scalable Node.js framework
- **PostgreSQL** — Relational database
- **Prisma ORM** — Database access
- **JWT** — Authentication & authorization
- **Bcrypt** — Secure password hashing
- **Redis** *(optional)* — Token management, caching
- **Swagger** — Auto-generated API docs
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
- Rider Registration & Login
- Profile Management
- Request a Ride (pickup & drop location)
- View Available Drivers
- View Ride History
- Rate Driver After Ride
- Wallet Balance & Transactions

### 🚖 Driver Features
- Driver Registration & Login
- Profile & Vehicle Management
- Accept/Reject Ride Requests
- Track Rides in Real-Time
- Update Ride Status (Started, In Progress, Completed)
- View Earnings & Ratings

### ⚙️ Admin Features
- View all registered users and drivers
- Manage support tickets
- View all rides and filter by status
- Issue promo codes
- Monitor transactions and disputes

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

