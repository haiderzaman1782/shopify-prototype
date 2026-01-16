# 🛒 Multi-Tenant E-Commerce Platform

A **full-stack, multi-tenant e-commerce platform** that enables users to create, customize, and manage independent online stores from a single system.

Designed for scalability, flexibility, and modern SaaS-style commerce solutions.

---

## 🚀 Features

### Multi-Tenant Architecture
- Independent stores per user
- Isolated store data with shared infrastructure
- Public storefronts with unique URLs

### Authentication & Security
- JWT-based authentication
- Secure password hashing
- Protected routes for store owners and admins

### Store Customization
- Pre-built themes: **Modern, Classic, Minimal**
- Live theme customization
- Branding support (logos, colors, banners)
- Custom navigation and homepage sections

### Product Management
- Full CRUD operations
- Categories and filtering
- Featured products
- Image uploads with metadata

### Shopping Experience
- Cart management
- Checkout flow
- Responsive, mobile-first UI

### Marketplace
- Browse all tenant stores
- Discover products across multiple sellers

### Admin Dashboard
- Store configuration
- Product and content management
- Centralized control panel

---

## 🧱 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS**
- **TypeScript** (in progress)
- Axios

### Backend
- **Node.js**
- **Express.js**
- RESTful API architecture
- JWT authentication
- Multer for image uploads

### Database
- **PostgreSQL**
- **Supabase compatible**
- JSONB for flexible store configuration

---

## 📁 Project Structure

```bash
E-Commerce-store/
├── backend/                 # Express.js API
│   ├── controllers/         # Business logic
│   ├── routes/              # API routes
│   ├── middleware/          # Auth & error handling
│   ├── config/              # App & DB config
│   └── server.js            # API entry point
│
├── frontend/                # Next.js app
│   ├── app/                 # App Router
│   │   ├── admin/           # Admin panel
│   │   ├── cart/            # Shopping cart
│   │   ├── dashboard/       # User dashboard
│   │   ├── marketplace/     # Store marketplace
│   │   └── storefront/      # Public storefront
│   │
│   ├── components/          # Reusable UI components
│   ├── contexts/            # Global state (Auth, Cart)
│   ├── themes/              # Theme configurations
│   └── lib/                 # Utilities & API helpers
│
└── database/                # Database files
    └── schema.sql           # PostgreSQL schema




---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` *(protected)*

### Store Management
- `GET /api/store/my-store`
- `PUT /api/store/my-store`
- `GET /api/store/:storeId`

### Products
- `GET /api/products`
- `POST /api/products` *(protected)*
- `PUT /api/products/:id` *(protected)*
- `DELETE /api/products/:id` *(protected)*

### Other
- `GET /api/marketplace`
- `GET /api/health`

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=shopify-preview
DB_PASSWORD=your_password
DB_PORT=5432
DB_SSL=false

JWT_SECRET=your_secure_secret
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development
