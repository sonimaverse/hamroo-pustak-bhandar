# 📚 Hamro Pustak Bhandar

**Hamro Pustak Bhandar** is a full-stack online bookstore and bookstore management platform designed for retail and wholesale book sales in Nepal.

The system combines an e-commerce storefront with inventory management, order management, wholesale customer management, quotations, billing, and administrative tools in a single application.

## ✨ Features

### 🛍️ Customer & E-commerce

* Browse books and categories
* Search and discover books
* Product details and pricing
* Shopping cart
* Customer registration and login
* Order placement and order tracking
* Customer profile management
* Enquiry submission

### 📦 Inventory & Product Management

* Book/product management
* Category management
* Stock quantity tracking
* Product CRUD operations
* Retail and wholesale pricing
* Inventory updates based on orders

### 🏢 Wholesale Management

* Wholesale customer registration
* Wholesale application submission
* Document/image upload support
* Admin approval and rejection workflow
* Wholesale-specific pricing
* Wholesale customer status management

### 📋 Quotations

* Create and manage quotations
* Quotation item management
* Discount and tax calculation
* Quotation status tracking
* Professional quotation generation

### 🧾 Orders & Billing

* Customer order management
* Admin order management
* Order status updates
* Payment status tracking
* Payment screenshot support
* Invoice generation
* Paid and due amount tracking
* Invoice printing
* Order → Invoice → Payment workflow

### 🔐 Authentication & Security

* JWT-based authentication
* Role-based authorization
* Protected admin routes
* Password hashing with bcrypt
* HTTP security headers with Helmet
* CORS configuration
* Request validation
* Centralized API error handling
* Environment-based configuration

### 👨‍💼 Admin Dashboard

The administration panel provides centralized management for:

* Dashboard overview
* Books
* Categories
* Wholesale applications
* Enquiries
* Quotations
* Orders
* Billing & invoices
* Users

## 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Axios
* Lucide React
* Motion

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT
* bcrypt
* Zod

### Services & Tools

* Cloudinary — image/document storage
* Postman — API testing
* Git & GitHub — version control
* Vercel — deployment

## 🏗️ Project Structure

```text
hamroo-pustak-bhandar/
│
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   ├── services/
│   ├── types/
│   └── ...
│
├── server/
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── ...
│
├── postman/
├── .github/
├── public/
├── server.ts
├── package.json
├── vite.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure the following are installed:

* Node.js 18+
* npm
* MongoDB / MongoDB Atlas
* Git

### 1. Clone the repository

```bash
git clone https://github.com/sonimaverse/hamroo-pustak-bhandar.git
cd hamroo-pustak-bhandar
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create your local environment file using `.env.example` as a reference.

```bash
cp .env.example .env
```

Configure the required values for:

* MongoDB connection
* JWT authentication
* Cloudinary
* Client URL
* Other application-specific settings

**Never commit your actual `.env` file or secret credentials to GitHub.**

### 4. Start the development server

```bash
npm run dev
```

The application will start in development mode.

### 5. Build for production

```bash
npm run build
```

### 6. Start the production build

```bash
npm start
```

## 🔌 API Overview

The backend exposes RESTful API endpoints for major application modules, including:

```text
/api/health
/api/auth
/api/books
/api/categories
/api/wholesale
/api/admin
/api/cart
/api/orders
/api/enquiries
/api/quotations
```

Additional billing/invoice endpoints are available as the billing module is enabled.

## 🔒 Environment & Security

Sensitive configuration is stored through environment variables rather than committed source code.

The repository intentionally excludes local environment files from version control.

Before deploying to production, configure:

* Strong JWT secrets
* Secure MongoDB credentials
* Cloudinary credentials
* Production client URL
* Appropriate CORS origins
* Production database configuration

## 🧪 API Testing

Postman collections are included in the repository for testing the backend API.

The API can be tested locally after starting the development server.

## 🌐 Deployment

The application is designed to support separate frontend/backend deployment and can be deployed using services such as Vercel and a managed MongoDB provider.

Production environment variables must be configured in the deployment platform before starting the application.

## 📌 Project Status

**Status:** Active Development

The project is being developed as a complete bookstore platform with e-commerce, wholesale management, inventory, orders, quotations, billing, and administration functionality.

## 👩‍💻 Author

**Sonima Pokharel**

GitHub: https://github.com/sonimaverse

## 📄 License

This project is intended for the Hamro Pustak Bhandar business application and is not currently published under an open-source license.
