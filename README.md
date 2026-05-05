<div align="center">

# 🔍 Expense Leak Detector API

**Detect subscriptions, unused services, and duplicate charges — automatically.**  
A fintech-inspired backend that analyzes transaction data to find where your money is silently leaking.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://prisma.io)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

[Report Bug](https://github.com/kranthikumar-dev/expense-leak-detector-api/issues) · [Request Feature](https://github.com/kranthikumar-dev/expense-leak-detector-api/issues)

</div>

---

## 📖 Overview

Most backend projects stop at CRUD. This one goes further.

The **Expense Leak Detector API** simulates a real-world fintech service that ingests user transactions and intelligently identifies spending leaks — recurring subscriptions, forgotten services, and suspicious duplicate charges — with zero manual intervention.

```
Transactions → Pattern Detection → Alert Generation → Lifecycle Management
```

Designed with a layered architecture, automated background jobs, and idempotent alert logic to reflect production-grade engineering practices.

---

## ✨ Features

| Module | Capabilities |
|---|---|
| 🔐 **Auth** | JWT registration & login, protected route middleware |
| 💳 **Transactions** | Add transactions, merchant name normalization |
| 🧠 **Detection Engine** | Subscription detection, unused service alerts, duplicate charge detection |
| 🚨 **Alert System** | Persistent alerts, idempotent generation, `ACTIVE → RESOLVED` lifecycle |
| ⏱️ **Automation** | Daily cron job scans all users and auto-generates alerts |

---

## 🏗️ Architecture

```
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
```

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JSON Web Tokens (JWT)
- **Scheduler:** node-cron

---

## 📂 Project Structure

```
expense-leak-detector-api/
└── src/
    ├── api/
    │   └── routes.js                    # Central route registry
    ├── config/
    │   ├── db.js                        # Database connection
    │   └── env.js                       # Environment config
    ├── jobs/
    │   └── leakDetection.job.js         # Daily cron job
    ├── middlewares/
    │   ├── auth.middleware.js           # JWT verification
    │   └── error.middleware.js          # Global error handler
    ├── modules/
    │   ├── auth/
    │   │   ├── auth.controller.js
    │   │   ├── auth.service.js
    │   │   └── auth.routes.js
    │   └── transactions/
    │       ├── transaction.controller.js
    │       ├── transaction.service.js
    │       ├── transaction.routes.js
    │       └── transaction.detection.js # Core detection logic
    ├── utils/
    │   └── merchantNormalizer.js        # Normalizes merchant names
    ├── app.js
    └── server.js
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL (local or hosted)

### 1. Clone the Repository

```bash
git clone https://github.com/kranthikumar-dev/expense-leak-detector-api.git
cd expense-leak-detector-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/expense_db
JWT_SECRET=your_secret_key
PORT=8000
```

### 4. Run Database Migrations

```bash
npx prisma migrate dev
```

### 5. Start the Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:8000/api`

---

## 📡 API Reference

### Authentication

All protected routes require a Bearer token:

```
Authorization: Bearer <your_jwt_token>
```

---

### 🔐 Auth Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register a new user | ❌ |
| `POST` | `/api/auth/login` | Login and receive JWT | ❌ |

---

### 💳 Transaction Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/transactions` | Add a new transaction | ✅ |

**Request Body**

```json
{
  "merchant": "Netflix",
  "amount": 649,
  "date": "2025-05-01T00:00:00.000Z"
}
```

---

### 🧠 Detection Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/transactions/subscriptions` | Get detected recurring subscriptions | ✅ |
| `GET` | `/api/transactions/alerts/unused` | Get unused subscription alerts | ✅ |
| `GET` | `/api/transactions/alerts/duplicates` | Get duplicate charge alerts | ✅ |

---

### 🚨 Alert Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/transactions/alerts/generate` | Manually trigger alert generation | ✅ |
| `GET` | `/api/transactions/alerts` | Get all alerts for current user | ✅ |
| `PATCH` | `/api/transactions/alerts/:id/resolve` | Resolve an active alert | ✅ |

---

## 🧠 Detection Logic

### 📊 Subscription Detection
Groups transactions by normalized merchant name and identifies recurring payments based on consistent amounts and charge frequency.

### ⚠️ Unused Subscription Detection
Calculates the number of days since the last transaction per merchant. If inactivity exceeds the configured threshold, an alert is generated.

### 🔁 Duplicate Charge Detection
Flags transactions from the same merchant with the same amount occurring within a short time window — a common sign of billing errors or accidental double charges.

---

## ⏱️ Background Automation

A daily cron job runs automatically to:

1. Scan transactions for all registered users
2. Run all three detection algorithms
3. Generate alerts with idempotent logic (no duplicate alerts created)

No manual trigger required — the system keeps itself up to date.

---

## 🗺️ Roadmap

- [ ] Analytics dashboard with spending breakdown
- [ ] Real-time notifications (WebSockets / push)
- [ ] Per-user spending insights and trends
- [ ] ML-based anomaly detection
- [ ] Webhook support for third-party integrations
- [ ] Multi-currency support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 👨‍💻 Author

**Kranthi Kumar**  
Backend Developer · Node.js | PostgreSQL | APIs

[![GitHub](https://img.shields.io/badge/GitHub-kranthikumar--dev-181717?style=flat-square&logo=github)](https://github.com/kranthikumar-dev)

---

## ⭐ Support

If this project helped you or gave you ideas for your own work:

- Give it a ⭐ on GitHub
- Share it with developers learning backend engineering

---

<div align="center">
  <sub>Built with ❤️ by Kranthi Kumar</sub>
</div>
