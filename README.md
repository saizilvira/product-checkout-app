# Product Checkout App

Full-stack application for product payment onboarding: show product and stock, collect card and delivery data, show payment summary, process the transaction, and update inventory.

## Live demo

| Layer | URL |
|-------|-----|
| **Frontend** | https://product-checkout-app-git-develop-vendly5.vercel.app/ |
| **Backend API** | https://product-checkout-app.onrender.com/ |

## Stack

### Frontend
- Vue 3 + TypeScript
- **Pinia** (state management)
- Vue Router
- Tailwind CSS (Flexbox / Grid, mobile-first)
- Axios
- Jest

**Why Pinia instead of Vuex?**  
Pinia is the official successor to Vuex for Vue 3, recommended by the Vue team. It follows Flux architecture (unidirectional data flow, centralized store). Checkout progress is persisted with `pinia-plugin-persistedstate` in `localStorage` so the flow survives page refresh.

### Backend
- NestJS + TypeScript
- TypeORM + PostgreSQL
- **Hexagonal Architecture** (Ports & Adapters)
- **Railway Oriented Programming (ROP)** via `Result<T, E>` in use cases
- Helmet, ValidationPipe, Throttler (OWASP-oriented)
- Jest

## Architecture (Backend)

```
domain/            → Entities, Value Objects, Repository ports
application/       → Use cases (business logic + ROP)
infrastructure/    → Adapters (TypeORM, payment gateway, HTTP)
```

Business logic is not handled in controllers. Controllers only validate input and call use cases.

## Data model

- **products** — id, name, description, price_in_cents, stock, image_url
- **customers** — id, full_name, email, phone, document_type, document_number
- **deliveries** — id, customer_id, address, city, region, postal_code, phone
- **transactions** — id, reference, payment_gateway_transaction_id, product_id, customer_id, delivery_id, amount/base_fee/delivery_fee/total (cents), status, card metadata, currency

All money values are stored in **cents**.

## Business flow (5 steps)

1. **Product page** — Product details and available stock  
2. **Credit card / Delivery info** — Modal for card data + delivery form  
3. **Summary** — Backdrop with product amount + base fee + delivery fee  
4. **Final status** — Transaction result (APPROVED / DECLINED / ERROR)  
5. **Product page** — Redirect with updated stock  

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/products` | Get product and stock |
| `GET` | `/products/:id` | Get product by id |
| `POST` | `/transactions` | Create transaction in `PENDING` |
| `POST` | `/transactions/process-payment` | Process payment with gateway |
| `GET` | `/transactions/:id` | Get transaction status |

### Postman

Import the collection from:

[`docs/postman_collection.json`](./docs/postman_collection.json)

Base URL variable: `https://product-checkout-app.onrender.com`

Quick smoke test:

```bash
curl https://product-checkout-app.onrender.com/products
```

## Local setup

### Requirements
- Node.js 20+
- PostgreSQL 16+
- npm

### Backend

```bash
cd backend
cp .env.example .env
# set DB_* and PAYMENT_* variables
npm install
npm run seed
npm run start:dev
```

### Frontend

```bash
cd frontend
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:3000
npm install
npm run dev
```

### Tests

```bash
# Backend
cd backend && npm run test:cov

# Frontend
cd frontend && npm run test:cov
```

## Test coverage

Unit tests run with **Jest** on both layers.

### Backend (`cd backend && npm run test:cov`)

| Metric | Coverage |
|--------|----------|
| **Statements** | **80.43%** |
| **Branches** | 75.47% |
| **Functions** | 93.18% |
| **Lines** | **81.47%** |

- Test suites: **22 passed**
- Tests: **85 passed**

### Frontend (`cd frontend && npm run test:cov`)

| Metric | Coverage |
|--------|----------|
| **Statements** | **43.82%** |
| **Branches** | 30.71% |
| **Functions** | 26.43% |
| **Lines** | **52.67%** |

- Test suites: **4 passed**
- Tests: **17 passed**

> Both layers target **>80%** line/statement coverage as required by the assessment.

## Security

- Helmet (HTTP security headers)
- Global `ValidationPipe` (`whitelist`, `forbidNonWhitelisted`)
- Rate limiting (`@nestjs/throttler`)
- Secrets only in environment variables
- Private payment key never exposed to the frontend
- HTTPS on production (Vercel + Render)

## Payment sandbox

Integration uses the UAT sandbox payment gateway provided for this challenge. Card data is fake but follows real card structure (Luhn). Test card: `4242 4242 4242 4242`.