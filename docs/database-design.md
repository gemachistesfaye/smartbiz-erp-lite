# Database Design (Prisma / PostgreSQL)

This document outlines the database schema for SmartBiz ERP Lite. The system is designed with a multi-tenant architecture to support future SaaS evolution.

## Multi-Tenancy Strategy
Every table (except the `Tenant` table itself) includes a `tenantId` foreign key. The backend application enforces data isolation at the ORM/Service layer by ensuring every query implicitly filters by the authenticated user's `tenantId`.

## Entity Relationship Diagram (ERD) Overview

- A **Tenant** has many **Users**, **Products**, **Categories**, **Customers**, and **Sales**.
- A **Product** belongs to a **Category** and has one **Inventory** record.
- A **Sale** belongs to a **Tenant**, is processed by a **User** (Cashier), and optionally belongs to a **Customer**.
- A **Sale** has many **SaleItems** (which link to **Products**).

## Prisma Schema Draft

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ------------------------------------------------------
// CORE MULTI-TENANCY & AUTH
// ------------------------------------------------------

model Tenant {
  id          String   @id @default(uuid())
  name        String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users       User[]
  products    Product[]
  categories  Category[]
  customers   Customer[]
  sales       Sale[]
}

enum Role {
  OWNER
  MANAGER
  CASHIER
}

model User {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  email       String   @unique
  password    String
  firstName   String
  lastName    String
  role        Role     @default(CASHIER)
  isActive    Boolean  @default(true)
  
  sales       Sale[]   // Sales processed by this user

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([tenantId])
}

// ------------------------------------------------------
// CATALOG & PRICING
// ------------------------------------------------------

model Category {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  name        String
  products    Product[]
  
  @@unique([tenantId, name])
}

model Product {
  id              String   @id @default(uuid())
  tenantId        String
  tenant          Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  categoryId      String?
  category        Category? @relation(fields: [categoryId], references: [id])
  
  name            String
  sku             String?
  barcode         String?
  
  // Pricing
  baseCost        Float    @default(0) // Raw cost of the item
  overheadCost    Float    @default(0) // Transport, tax, etc.
  landedCost      Float    @default(0) // baseCost + overheadCost
  sellingPrice    Float    @default(0)
  
  inventory       Inventory?
  saleItems       SaleItem[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@index([tenantId])
  @@index([barcode])
}

// ------------------------------------------------------
// INVENTORY
// ------------------------------------------------------

model Inventory {
  id          String   @id @default(uuid())
  productId   String   @unique
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  quantity    Int      @default(0)
  minThreshold Int     @default(5) // Alert when stock drops below this
  
  updatedAt   DateTime @updatedAt
}

// ------------------------------------------------------
// CUSTOMERS & SALES
// ------------------------------------------------------

model Customer {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  firstName   String
  lastName    String?
  phone       String?
  creditBalance Float  @default(0) // Positive means they owe the business money
  
  sales       Sale[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([tenantId])
}

enum PaymentMethod {
  CASH
  MOBILE_MONEY
  CREDIT
}

model Sale {
  id          String   @id @default(uuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  
  cashierId   String
  cashier     User     @relation(fields: [cashierId], references: [id])
  
  customerId  String?
  customer    Customer? @relation(fields: [customerId], references: [id])
  
  paymentMethod PaymentMethod
  totalAmount Float
  
  items       SaleItem[]

  createdAt   DateTime @default(now())
  
  @@index([tenantId])
}

model SaleItem {
  id          String   @id @default(uuid())
  saleId      String
  sale        Sale     @relation(fields: [saleId], references: [id], onDelete: Cascade)
  
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  
  quantity    Int
  unitPrice   Float
  totalPrice  Float    // quantity * unitPrice
}
```
