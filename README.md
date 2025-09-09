# Workforce Service (workforce-svc)

A backend service built with **Fastify**, **Prisma ORM**, and **PostgreSQL** for managing users, roles, authentication, and health monitoring.  
The project is structured for scalability, security, and ease of integration.

---

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based login
  - Role-based access control (Admin, Supervisor, Worker, etc.)

- **Database**
  - PostgreSQL with Prisma ORM
  - Migrations and seeding included
  - User ↔ Role relational model

- **Security**
  - Helmet for HTTP headers
  - CORS configuration
  - Rate limiting

- **Health Monitoring**
  - `/v1/health` endpoint checks DB connectivity and PostGIS availability

- **Developer Experience**
  - TypeScript support
  - Zod-based environment validation
  - Centralized plugin system for Prisma, security, and auth

---

## 📂 Project Structure

```
workforce-svc/
├── prisma/                # Database schema, migrations, and seeds
│   ├── migrations/        # Prisma migration files
│   ├── schema.prisma      # Prisma schema definition
│   └── seed.ts            # Seed script (roles + admin user)
├── src/
│   ├── config/            # Environment validation (dotenv + zod)
│   ├── plugins/           # Fastify plugins (prisma, auth, security)
│   ├── routes/            # API route definitions
│   ├── app.ts             # Fastify app builder
│   └── server.ts          # Entry point (server bootstrap)
├── .env                   # Environment variables
├── package.json
└── tsconfig.json
```

---

## 🛠️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/workforce-svc.git
cd workforce-svc
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file (see `.env.example`):

```env
DATABASE_URL="postgresql://postgres:root@localhost:5433/postgres?schema=public"
JWT_SECRET="super-secret-change-me"
JWT_EXPIRES_IN=1h

PORT=3000
NODE_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
RATE_MAX=100
RATE_WINDOW_MS=60000
```

### 4. Run Database Migrations & Seed
```bash
npx prisma migrate dev --name init_user_roles
npx ts-node prisma/seed.ts
```

### 5. Start the Server
```bash
npm run dev
```
Server will be available at:  
👉 [http://localhost:3000](http://localhost:3000)

---

## 🔑 Authentication

- **Login Endpoint:** `/v1/auth/login`  
- **Headers:** `Authorization: Bearer <token>`  
- **Token Expiry:** Configurable via `JWT_EXPIRES_IN`

Seeded admin user (from `prisma/seed.ts`):
```
Email: saurav@gmail.com
Password: admin123
```

---

## 📡 API Endpoints

### Health
```http
GET /v1/health
```

### Auth
```http
POST /v1/auth/login
```

### Users
```http
GET /v1/users
```

### Admin
```http
GET /v1/admin/dashboard
```

---

## 📦 Tech Stack

- **Framework:** Fastify
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Language:** TypeScript
- **Security:** Helmet, CORS, Rate-limit
- **Auth:** JWT

---

## 🧪 Development

- **Run in Dev Mode:**
  ```bash
  npm run dev
  ```
- **Run Migrations:**
  ```bash
  npx prisma migrate dev
  ```
- **Database Studio:**
  ```bash
  npx prisma studio
  ```

---

## 📜 License
MIT License – feel free to use and modify for your projects.
