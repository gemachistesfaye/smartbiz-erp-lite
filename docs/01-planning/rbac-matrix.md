# Role-Based Access Control (RBAC) Matrix
## SmartBiz ERP Lite

---

## 1. Role Definitions

| Role | Description | Typical User | Scope |
|:-----|:------------|:-------------|:------|
| **OWNER** | Full system access. Creates and manages the business. | Business owner (Alem) | Tenant-wide admin |
| **MANAGER** | Operational access. Manages daily shop operations. | Store manager (Dawit) | Day-to-day operations |
| **CASHIER** | Transactional access. Processes sales and basic lookups. | Front-line cashier (Fatima) | Point-of-sale only |

---

## 2. Permission Matrix

### Authentication & User Management

| Resource | Action | OWNER | MANAGER | CASHIER |
|:---------|:-------|:------|:--------|:--------|
| Register business | Create | Yes | No | No |
| Login | Access | Yes | Yes | Yes |
| View own profile | Read | Yes | Yes | Yes |
| Update own profile | Update | Yes | Yes | Yes |
| List all users | Read | Yes | No | No |
| Create user (Manager/Cashier) | Create | Yes | No | No |
| Update user details | Update | Yes | No | No |
| Change user role | Update | Yes | No | No |
| Deactivate user | Delete | Yes | No | No |
| Reactivate user | Update | Yes | No | No |

### Product & Category Management

| Resource | Action | OWNER | MANAGER | CASHIER |
|:---------|:-------|:------|:--------|:--------|
| List products | Read | Yes | Yes | Yes |
| View product details | Read | Yes | Yes | Yes |
| Search products | Read | Yes | Yes | Yes |
| Create product | Create | Yes | Yes | No |
| Update product | Update | Yes | Yes | No |
| Delete product | Delete | Yes | No | No |
| List categories | Read | Yes | Yes | Yes |
| Create category | Create | Yes | Yes | No |
| Update category | Update | Yes | Yes | No |
| Delete category | Delete | Yes | No | No |

### Inventory Management

| Resource | Action | OWNER | MANAGER | CASHIER |
|:---------|:-------|:------|:--------|:--------|
| View inventory levels | Read | Yes | Yes | Yes |
| View low-stock alerts | Read | Yes | Yes | Yes |
| Adjust stock levels | Update | Yes | Yes | No |
| View adjustment history | Read | Yes | Yes | No |
| Set min threshold | Update | Yes | Yes | No |

### Point of Sale (POS)

| Resource | Action | OWNER | MANAGER | CASHIER |
|:---------|:-------|:------|:--------|:--------|
| Access POS screen | Read | Yes | Yes | Yes |
| Search products in POS | Read | Yes | Yes | Yes |
| Add items to cart | Create | Yes | Yes | Yes |
| Process cash sale | Create | Yes | Yes | Yes |
| Process mobile money sale | Create | Yes | Yes | Yes |
| Process credit sale | Create | Yes | Yes | No |
| Void sale before completion | Delete | Yes | Yes | Yes |
| View own sales today | Read | Yes | Yes | Yes |
| View all sales | Read | Yes | Yes | No |
| View sale details | Read | Yes | Yes | Yes |

### Customer & Credit Management

| Resource | Action | OWNER | MANAGER | CASHIER |
|:---------|:-------|:------|:--------|:--------|
| List customers | Read | Yes | Yes | Yes |
| View customer details | Read | Yes | Yes | Yes |
| Search customers | Read | Yes | Yes | Yes |
| Create customer | Create | Yes | Yes | Yes |
| Update customer details | Update | Yes | Yes | No |
| Log payment against debt | Update | Yes | Yes | No |
| View payment history | Read | Yes | Yes | No |
| Set credit limit | Update | Yes | No | No |
| View total outstanding debt | Read | Yes | Yes | No |

### Dashboard & Reports

| Resource | Action | OWNER | MANAGER | CASHIER |
|:---------|:-------|:------|:--------|:--------|
| View dashboard | Read | Yes | Yes | No |
| View today's sales summary | Read | Yes | Yes | No |
| View sales reports | Read | Yes | Yes | No |
| View top products report | Read | Yes | Yes | No |
| View debt summary report | Read | Yes | Yes | No |
| Export reports | Read | Yes | No | No |

---

## 3. Frontend Route Guards

| Route | Accessible Roles | Redirect |
|:------|:-----------------|:---------|
| `/login` | Public (unauthenticated) | → `/dashboard` if logged in |
| `/register` | Public (unauthenticated) | → `/dashboard` if logged in |
| `/dashboard` | OWNER, MANAGER | → `/pos` for CASHIER |
| `/pos` | ALL | None |
| `/products` | OWNER, MANAGER | → `/pos` for CASHIER |
| `/products/:id` | OWNER, MANAGER | → `/pos` for CASHIER |
| `/inventory` | OWNER, MANAGER | → `/pos` for CASHIER |
| `/customers` | ALL | None |
| `/customers/:id` | ALL | None |
| `/sales` | OWNER, MANAGER | → `/pos` for CASHIER |
| `/reports` | OWNER, MANAGER | → `/pos` for CASHIER |
| `/settings` | ALL | None |
| `/users` | OWNER only | → `/dashboard` for others |

---

## 4. Backend Route Guards

```typescript
// NestJS Guard Implementation Pattern

@UseGuards(AuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {

  @Get()
  @Roles('OWNER', 'MANAGER', 'CASHIER')
  findAll(@TenantId() tenantId: string) {
    return this.productsService.findAll(tenantId);
  }

  @Post()
  @Roles('OWNER', 'MANAGER')
  create(@Body() dto: CreateProductDto, @TenantId() tenantId: string) {
    return this.productsService.create(dto, tenantId);
  }

  @Delete(':id')
  @Roles('OWNER')
  remove(@Param('id') id: string, @TenantId() tenantId: string) {
    return this.productsService.remove(id, tenantId);
  }
}
```

---

## 5. Data Access Rules

### Tenant Isolation
- ALL queries are automatically filtered by `tenantId`
- A Manager/Cashier in Tenant A can NEVER access Tenant B data
- Enforced at ORM middleware level (Prisma)

### Self-Service Restrictions
- Users can only update their own profile (name, password)
- Users CANNOT change their own role
- Users CANNOT deactivate their own account

### Cashier-Specific Rules
- Cashiers can only view their own sales (filtered by `cashierId`)
- Cashiers CANNOT process credit sales (requires Manager+)
- Cashiers CANNOT adjust inventory
- Cashiers CANNOT view other cashiers' sales data

---

## 6. Permission Inheritance

```
OWNER inherits all permissions
    │
    ├── Inherits MANAGER permissions
    │   ├── Product management (except delete)
    │   ├── Inventory management
    │   ├── Customer management
    │   ├── POS operations
    │   └── Reports access
    │
    └── Plus exclusive permissions:
        ├── User management (CRUD)
        ├── Product deletion
        ├── Category deletion
        ├── Credit limit setting
        └── Full report access + export

MANAGER inherits all CASHIER permissions
    │
    ├── POS operations
    ├── Customer lookup
    │
    └── Plus exclusive permissions:
        ├── Product CRUD (except delete)
        ├── Category management
        ├── Inventory adjustments
        ├── Credit payment processing
        ├── Dashboard access
        └── Reports access

CASHIER has base permissions:
    ├── POS operations (cash & mobile money only)
    ├── Product search/lookup
    ├── Customer registration
    ├── View own sales
    └── Profile management
```

---

## 7. Security Implementation Notes

### JWT Token Contains:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "role": "CASHIER",
  "tenantId": "tenant-uuid"
}
```

### Validation Flow:
1. Auth Guard validates JWT signature and expiry
2. Tenant Guard extracts `tenantId` from JWT payload
3. Roles Guard checks user's role against `@Roles()` decorator
4. Service layer enforces business rules (e.g., cashier can't do credit sales)

### Denial Response:
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions",
  "error": "Forbidden"
}
```
