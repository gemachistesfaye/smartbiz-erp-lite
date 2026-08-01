# API Documentation

This document provides a high-level overview of the RESTful API architecture built with NestJS for SmartBiz ERP Lite.

## Authentication & Authorization
The API uses stateless JSON Web Tokens (JWT) for authentication.
- **Header:** `Authorization: Bearer <token>`
- **Payload:** Contains `userId`, `role`, and `tenantId`.

All endpoints (except login/register) require authentication and enforce Role-Based Access Control (RBAC) and Tenant isolation via NestJS Guards and Interceptors.

## Core Endpoints

### 1. Authentication
| Method | Endpoint | Description | Auth Required | Roles |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/api/auth/register` | Register a new Tenant and Owner account | No | None |
| POST | `/api/auth/login` | Authenticate user and receive JWT | No | None |
| GET | `/api/auth/me` | Get current authenticated user profile | Yes | All |

### 2. Users (Staff Management)
| Method | Endpoint | Description | Auth Required | Roles |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/users` | List all staff members for the tenant | Yes | OWNER |
| POST | `/api/users` | Create a new Manager or Cashier | Yes | OWNER |
| PUT | `/api/users/:id` | Update staff details or role | Yes | OWNER |
| DELETE| `/api/users/:id` | Deactivate a staff member | Yes | OWNER |

### 3. Products
| Method | Endpoint | Description | Auth Required | Roles |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/products` | Get all products (with optional search/filter) | Yes | All |
| GET | `/api/products/:id`| Get single product details | Yes | All |
| POST | `/api/products` | Create a new product (calculates landed cost) | Yes | OWNER, MANAGER |
| PUT | `/api/products/:id`| Update product details and pricing | Yes | OWNER, MANAGER |
| DELETE| `/api/products/:id`| Delete a product | Yes | OWNER |

### 4. Inventory
| Method | Endpoint | Description | Auth Required | Roles |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/inventory/low-stock` | Get items below their `minThreshold` | Yes | All |
| POST | `/api/inventory/adjust` | Manually adjust stock levels | Yes | OWNER, MANAGER |

### 5. Customers (Credit Management)
| Method | Endpoint | Description | Auth Required | Roles |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/customers` | Get all customers (with credit balances) | Yes | All |
| POST | `/api/customers` | Register a new customer | Yes | All |
| POST | `/api/customers/:id/payment` | Log a payment against a customer's debt | Yes | OWNER, MANAGER |

### 6. Sales (POS)
| Method | Endpoint | Description | Auth Required | Roles |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/sales` | Get sales history | Yes | All (Cashiers see own) |
| POST | `/api/sales/checkout` | Process a sale (Deducts stock, updates credit) | Yes | All |
| POST | `/api/sales/sync` | Bulk sync offline sales from IndexedDB | Yes | All |

## Error Handling
All API errors return a standard JSON structure:
```json
{
  "statusCode": 400,
  "message": ["price must be a positive number", "sku must be a string"],
  "error": "Bad Request"
}
```
