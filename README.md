# 🚀 Expense Leak Detector API

Detect subscriptions, unused services, and duplicate charges from user transactions using a production-style backend system.

---

## 🧠 Overview

This project is a fintech-inspired backend service that analyzes transaction data to identify spending leaks and generate intelligent alerts.

It simulates real-world backend behavior with:
- pattern detection
- alert lifecycle management
- automated background jobs

---

## 🔥 Features

### 🔐 Authentication
- JWT-based login & registration
- Secure protected routes

### 💳 Transaction Management
- Add and manage user transactions
- Merchant normalization for accurate analysis

### 🧠 Detection Engine
- 📊 Subscription detection (recurring payments)
- ⚠️ Unused subscription alerts
- 🔁 Duplicate charge detection

### 🚨 Alert System
- Persistent alerts stored in database
- Duplicate alert prevention (idempotent logic)
- Alert lifecycle: `ACTIVE → RESOLVED`

### ⏱ Automation
- Daily cron job scans transactions
- Automatically generates alerts
- No manual intervention required

---

## 🏗️ Architecture


Client (Postman / Frontend)
│
▼
Express API Layer
│
▼
Controllers
│
▼
Services (Business Logic)
│
▼
Detection Engine
│
▼
Prisma ORM
│
▼
PostgreSQL Database
│
▼
Cron Job (node-cron)
│
▼
Automated Alert Generation


---

## ⚙️ Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- node-cron

---

## 📁 Project Structure


src/
├── config/
│ ├── db.js
│ └── env.js
├── modules/
│ ├── auth/
│ └── transactions/
├── services/
│ └── detection.service.js
├── jobs/
│ └── leakDetection.job.js
├── middlewares/
│ └── auth.middleware.js
└── server.js


---

## 🔌 API Documentation

### 🔐 Auth

#### Register

POST /api/auth/register


#### Login

POST /api/auth/login


---

### 💳 Transactions

#### Add Transaction

POST /api/transactions
Authorization: Bearer TOKEN


---

### 🧠 Detection

#### Get Subscriptions

GET /api/transactions/subscriptions


#### Get Unused Alerts

GET /api/transactions/alerts/unused


#### Get Duplicate Alerts

GET /api/transactions/alerts/duplicates


---

### 🚨 Alerts

#### Generate Alerts (Manual)

POST /api/transactions/alerts/generate


#### Get All Alerts

GET /api/transactions/alerts


#### Resolve Alert

PATCH /api/transactions/alerts/:id/resolve


---

## 🧠 Detection Logic

### Subscription Detection
- Groups transactions by merchant
- Identifies recurring payments using amount & frequency

### Unused Detection
- Calculates inactivity based on last transaction date
- Triggers alert if unused for threshold days

### Duplicate Detection
- Detects same merchant + same amount within short time window

---

## ⏱ Background Jobs

- Runs daily using cron
- Scans all users
- Generates alerts automatically

---

## 🚀 Getting Started

### 1. Clone repository
```bash
git clone https://github.com/kranthikumar-dev/expense-leak-detector-api.git
cd expense-leak-detector-api
2. Install dependencies
npm install
3. Setup environment variables

Create .env file:

DATABASE_URL=postgresql://postgres:password@localhost:5432/expense_db
JWT_SECRET=your_secret_key
PORT=8000
4. Run database migrations
npx prisma migrate dev
5. Start server
npm run dev
💣 Why This Project Stands Out

Most backend projects:

Basic CRUD APIs ❌

This project:

Data → Pattern Detection → Alerts → Automation → Lifecycle Management ✅
📌 Future Improvements
📊 Analytics dashboard (frontend)
🔔 Real-time notifications
📈 Spending insights
🤖 ML-based anomaly detection
👨‍💻 Author

Kranthi Kumar
Backend Developer (Node.js | PostgreSQL | APIs)

⭐ Show Your Support

If you found this project useful, consider giving it a ⭐ on GitHub!