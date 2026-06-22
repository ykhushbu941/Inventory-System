# 🏭 InvenTrack — Inventory & Order Management System

A production-ready full-stack application for managing products, customers, orders, and inventory.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite |
| Backend | Python + FastAPI |
| Database | PostgreSQL |
| Containerization | Docker + Docker Compose |

## Features

- **Product Management** — CRUD with unique SKU enforcement, stock tracking
- **Customer Management** — CRUD with unique email enforcement
- **Order Management** — Create multi-item orders, auto stock reduction, cancel with stock restore
- **Dashboard** — Live stats: total products, customers, orders, low-stock alerts
- **Business Rules** — Insufficient stock blocks order creation, total auto-calculated

---

## 🚀 Quick Start (Local with Docker)

```bash
git clone <your-repo-url>
cd inventory-system
cp .env.example .env
docker compose up --build
```

Then open:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

---

## 🛠 Local Dev (Without Docker)

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/inventory_db uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
VITE_API_URL=http://localhost:8000 npm run dev
```

---

## ☁️ Deployment Guide

### Backend → Render

1. Push code to GitHub
2. Go to https://render.com → New → Web Service
3. Connect your GitHub repo → select `backend/` directory
4. Set:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variable: `DATABASE_URL` (from Render PostgreSQL or Supabase)
6. Deploy → copy the URL (e.g. `https://inventrack-api.onrender.com`)

### Frontend → Vercel

1. Go to https://vercel.com → New Project → Import from GitHub
2. Set **Root Directory** to `frontend`
3. Add environment variable: `VITE_API_URL=https://your-render-backend-url.onrender.com`
4. Deploy → copy the URL

### Docker Hub (Backend Image)

```bash
docker build -t yourdockerhubuser/inventrack-backend:latest ./backend
docker push yourdockerhubuser/inventrack-backend:latest
```

---

## 📡 API Reference

### Products
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /products | Create product |
| GET | /products | List all products |
| GET | /products/{id} | Get product |
| PUT | /products/{id} | Update product |
| DELETE | /products/{id} | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /customers | Create customer |
| GET | /customers | List all customers |
| GET | /customers/{id} | Get customer |
| DELETE | /customers/{id} | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | /orders | Create order (reduces stock) |
| GET | /orders | List all orders |
| GET | /orders/{id} | Get order details |
| DELETE | /orders/{id} | Cancel order (restores stock) |

### Dashboard
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | /dashboard | Get summary stats |

Full interactive docs: `/docs` (Swagger UI)

---

## Business Rules Implemented

- ✅ Product SKU must be unique
- ✅ Customer email must be unique
- ✅ Product quantity cannot be negative
- ✅ Orders blocked if insufficient inventory
- ✅ Creating an order auto-reduces stock
- ✅ Cancelling an order restores stock
- ✅ Order total calculated server-side
- ✅ All requests validated before processing
- ✅ Appropriate HTTP status codes (201, 204, 400, 404)

---

## Project Structure

```
inventory-system/
├── backend/
│   ├── app/
│   │   ├── core/database.py
│   │   ├── models/models.py
│   │   ├── schemas/schemas.py
│   │   ├── routes/{products,customers,orders,dashboard}.py
│   │   └── main.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .dockerignore
├── frontend/
│   ├── src/
│   │   ├── api/index.js
│   │   ├── components/{shared,dashboard,products,customers,orders}/
│   │   ├── context/ToastContext.jsx
│   │   └── App.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .dockerignore
└── docker-compose.yml
```
