# Hamro Pustak Bhandar - API Documentation

Base URL: `http://localhost:5000/api/v1`

All endpoints return JSON with the following envelope:
```json
{
  "success": boolean,
  "message": string,
  "data": {}
}
```

---

## Table of Contents

1. [Authentication](#authentication)
2. [Wholesale Registration](#wholesale-registration)
3. [Products](#products)
4. [Inventory](#inventory)
5. [Dashboard](#dashboard)

---

## Authentication

### Register a new user
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+9779841000001",
  "password": "password123",
  "businessName": "ABC Traders",
  "panVatNumber": "123456789",
  "address": "Kathmandu, Nepal"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "userId": "USR000001", "fullName": "John Doe", "email": "john@example.com" },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

### Login
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "userId": "USR000001", "fullName": "John Doe" },
    "accessToken": "eyJhbG...",
    "refreshToken": "eyJhbG..."
  }
}
```

### Get Profile (Authenticated)
```http
GET /api/v1/auth/profile
Authorization: Bearer <accessToken>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": {
    "user": { "userId": "USR000001", "fullName": "John Doe", "email": "john@example.com" }
  }
}
```

### Refresh Token
```http
POST /api/v1/auth/refresh
Cookie: refreshToken=<refreshToken>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": { "accessToken": "eyJhbG..." }
}
```

### Logout (Authenticated)
```http
POST /api/v1/auth/logout
Authorization: Bearer <accessToken>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Wholesale Registration

### Submit Wholesale Application (Authenticated)
```http
POST /api/v1/wholesale/apply
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "businessName": "ABC Traders",
  "panVatNumber": "123456789",
  "address": "Kathmandu, Nepal",
  "phone": "+9779841000001",
  "documents": [
    {
      "type": "business_registration",
      "fileName": "registration.pdf",
      "url": "https://res.cloudinary.com/...",
      "publicId": "hamro-pustak/documents/abc123",
      "verified": false
    }
  ]
}
```

### Get My Application (Authenticated)
```http
GET /api/v1/wholesale/my-application
Authorization: Bearer <accessToken>
```

### Get Pending Applications (Admin Only)
```http
GET /api/v1/wholesale/pending
Authorization: Bearer <adminAccessToken>
```

### Approve Application (Admin Only)
```http
POST /api/v1/wholesale/:id/approve
Authorization: Bearer <adminAccessToken>
```

### Reject Application (Admin Only)
```http
POST /api/v1/wholesale/:id/reject
Authorization: Bearer <adminAccessToken>
Content-Type: application/json

{
  "reason": "Invalid business registration document"
}
```

---

## Products

### Get All Products (Public)
```http
GET /api/v1/products?page=1&limit=12&category=Fiction&sort=price_asc&search=gatsby
```

**Query Parameters:**
- `page` (number): Page number, default 1
- `limit` (number): Items per page, default 12, max 50
- `category` (string): Filter by category
- `status` (string): Filter by status
- `sort` (string): `price_asc`, `price_desc`, `newest`, `featured`
- `search` (string): Full-text search across title, author, description
- `inStock` (boolean): Filter in-stock items only
- `minPrice` (number): Minimum retail price
- `maxPrice` (number): Maximum retail price

**Response 200:**
```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": {
    "products": [
      {
        "_id": "64f1b2c3d4e5f67890123456",
        "sku": "SKU00000001",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "category": "Fiction",
        "retailPrice": 500,
        "wholesalePrice": 350,
        "stock": 100,
        "images": ["https://..."],
        "isLowStock": false,
        "featured": true,
        "status": "active"
      }
    ],
    "PAGINATION.DEFAULT_PAGE": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 60,
      "itemsPerPage": 12,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

**Note:** `wholesalePrice` is only returned for `wholesale_approved` and `admin` roles.

### Get Product by ID (Public)
```http
GET /api/v1/products/:id
```

### Create Product (Admin Only)
```http
POST /api/v1/products
Authorization: Bearer <adminAccessToken>
Content-Type: multipart/form-data

Form fields:
- title (required)
- slug (optional, auto-generated)
- isbn (optional)
- author (optional)
- publisher (optional)
- category (required)
- description (optional)
- retailPrice (required)
- wholesalePrice (required)
- stock (required)
- minimumStock (required)
- featured (boolean)
- status (string)
- images (files, multiple)
```

### Update Product (Admin Only)
```http
PUT /api/v1/products/:id
Authorization: Bearer <adminAccessToken>
Content-Type: multipart/form-data
```

### Delete Product (Admin Only - Soft Delete)
```http
DELETE /api/v1/products/:id
Authorization: Bearer <adminAccessToken>
```

### Update Stock (Admin Only)
```http
PATCH /api/v1/products/:id/stock
Authorization: Bearer <adminAccessToken>
Content-Type: application/json

{
  "stock": 500
}
```

### Update Pricing (Admin Only)
```http
PATCH /api/v1/products/:id/pricing
Authorization: Bearer <adminAccessToken>
Content-Type: application/json

{
  "retailPrice": 600,
  "wholesalePrice": 400
}
```

### Add Images (Admin Only)
```http
POST /api/v1/products/:id/images
Authorization: Bearer <adminAccessToken>
Content-Type: multipart/form-data

Form fields:
- images (files, multiple)
```

### Remove Image (Admin Only)
```http
DELETE /api/v1/products/:id/images?imageUrl=https://...
Authorization: Bearer <adminAccessToken>
```

---

## Inventory

### Add Stock (Admin Only)
```http
PATCH /api/v1/inventory/:productId/add
Authorization: Bearer <adminAccessToken>
Content-Type: application/json

{
  "quantity": 50,
  "reason": "New shipment received"
}
```

### Remove Stock (Admin Only)
```http
PATCH /api/v1/inventory/:productId/remove
Authorization: Bearer <adminAccessToken>
Content-Type: application/json

{
  "quantity": 10,
  "reason": "Damaged goods"
}
```

### Set Stock (Admin Only)
```http
PATCH /api/v1/inventory/:productId/set
Authorization: Bearer <adminAccessToken>
Content-Type: application/json

{
  "stock": 500
}
```

### Get Stock History (Admin Only)
```http
GET /api/v1/inventory/history/:productId?page=1&limit=20
Authorization: Bearer <adminAccessToken>
```

### Get Low Stock Products (Admin Only)
```http
GET /api/v1/inventory/low-stock?page=1&limit=10
Authorization: Bearer <adminAccessToken>
```

---

## Dashboard

### Overview (Admin Only)
```http
GET /api/v1/dashboard/overview
Authorization: Bearer <adminAccessToken>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Dashboard overview fetched successfully",
  "data": {
    "totalProducts": 120,
    "totalUsers": 45,
    "approvedWholesaleUsers": 12,
    "pendingApplications": 3,
    "lowStockProducts": 5,
    "outOfStockProducts": 2
  }
}
```

### Product Stats (Admin Only)
```http
GET /api/v1/dashboard/products/stats
Authorization: Bearer <adminAccessToken>
```

### User Stats (Admin Only)
```http
GET /api/v1/dashboard/users/stats
Authorization: Bearer <adminAccessToken>
```

---

## Error Responses

| Status | Code | Meaning |
|--------|------|---------|
| 400 | BAD_REQUEST | Invalid input or validation error |
| 401 | UNAUTHORIZED | Missing or invalid authentication token |
| 403 | FORBIDDEN | Authenticated but insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Duplicate entry (e.g., email already exists) |
| 422 | UNPROCESSABLE | Validation error from Mongoose |
| 500 | SERVER_ERROR | Unexpected server error |

**Error format:**
```json
{
  "success": false,
  "message": "Error description"
}
```
