# Hamro Pustak Bhandar - Backend

Production-ready wholesale bookstore management system backend.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** JWT + bcrypt
- **Image Storage:** Cloudinary
- **File Upload:** Multer
- **Validation:** Zod, Express Validator
- **Security:** Helmet, CORS, express-mongo-sanitize, xss, express-rate-limit
- **Logging:** Pino
- **Architecture:** MVC with Repository/Service/Controller pattern

## Project Structure

```
backend/
├── src/
│   ├── config/           # Database, Cloudinary config
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Auth, error, XSS, upload, logger
│   ├── models/           # Mongoose schemas
│   ├── repositories/     # Data access layer
│   ├── routes/           # API route definitions
│   ├── services/         # Business logic
│   ├── utils/            # Helpers, constants, error classes
│   ├── validators/       # Validation schemas
│   ├── app.js            # Express app config
│   └── server.js         # Entry point
├── tests/
│   └── integration/      # Integration tests
├── package.json
├── .env.example
├── API.md
└── README.md
```

## Installation

```bash
cd backend
npm install
```

## Environment Setup

Create a `.env` file in the backend root:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hamro-pustak-bhandar
JWT_SECRET=<your-jwt-secret-min-32-chars>
JWT_EXPIRE=15m
REFRESH_TOKEN_SECRET=<your-refresh-token-secret-min-32-chars>
REFRESH_TOKEN_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
CLIENT_URL=http://localhost:5173
```

## Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## API Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Public | Register new user |
| POST | `/api/v1/auth/login` | Public | Login |
| POST | `/api/v1/auth/refresh` | Public | Refresh access token |
| POST | `/api/v1/auth/logout` | Authenticated | Logout |
| GET | `/api/v1/auth/profile` | Authenticated | Get current user |
| POST | `/api/v1/wholesale/apply` | Authenticated | Submit wholesale application |
| GET | `/api/v1/wholesale/my-application` | Authenticated | Get my application |
| GET | `/api/v1/wholesale/pending` | Admin | View pending applications |
| POST | `/api/v1/wholesale/:id/approve` | Admin | Approve application |
| POST | `/api/v1/wholesale/:id/reject` | Admin | Reject application |
| GET | `/api/v1/products` | Public | List products with filters |
| GET | `/api/v1/products/:id` | Public | Get product details |
| POST | `/api/v1/products` | Admin | Create product |
| PUT | `/api/v1/products/:id` | Admin | Update product |
| DELETE | `/api/v1/products/:id` | Admin | Delete product |
| PATCH | `/api/v1/products/:id/stock` | Admin | Update stock |
| PATCH | `/api/v1/products/:id/pricing` | Admin | Update pricing |
| POST | `/api/v1/products/:id/images` | Admin | Add images |
| DELETE | `/api/v1/products/:id/images` | Admin | Remove image |
| PATCH | `/api/v1/inventory/:productId/add` | Admin | Add stock |
| PATCH | `/api/v1/inventory/:productId/remove` | Admin | Remove stock |
| PATCH | `/api/v1/inventory/:productId/set` | Admin | Set stock |
| GET | `/api/v1/inventory/history/:productId` | Admin | Stock history |
| GET | `/api/v1/inventory/low-stock` | Admin | Low stock products |
| GET | `/api/v1/dashboard/overview` | Admin | Dashboard overview |
| GET | `/api/v1/dashboard/products/stats` | Admin | Product statistics |
| GET | `/api/v1/dashboard/users/stats` | Admin | User statistics |
| GET | `/api/v1/health` | Public | Health check |

## User Roles

- `guest` - Unauthenticated user
- `wholesale_pending` - Awaiting approval
- `wholesale_approved` - Approved wholesale customer
- `admin` - Full system access

## Features

- JWT authentication with refresh token rotation
- Role-based access control (RBAC)
- Price visibility based on role
- Soft delete for products
- Stock tracking with history
- Image management via Cloudinary
- Rate limiting
- XSS sanitization
- MongoDB injection prevention
- Structured logging with Pino
- Environment validation at startup

## Testing

```bash
# Run integration tests
node tests/integration/health.test.js
node tests/integration/auth.test.js
node tests/integration/products.test.js
node tests/integration/security.test.js
```

## Security Checklist

- [x] Helmet security headers
- [x] CORS with whitelisted origin
- [x] express-mongo-sanitize
- [x] XSS sanitization
- [x] Rate limiting
- [x] JWT with short expiry + refresh token
- [x] httpOnly refresh token cookies
- [x] Password hashing with bcrypt (10 rounds)
- [x] Environment variable validation
- [x] No hardcoded secrets
