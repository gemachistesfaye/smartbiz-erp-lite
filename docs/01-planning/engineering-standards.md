# Engineering Standards
## SmartBiz ERP Lite

---

## 1. Folder Organization

### Root Structure
```
smartbiz-erp-lite/
├── frontend/          # React PWA (TanStack Start + Vite)
├── backend/           # NestJS API
├── docs/              # All project documentation
├── .github/           # GitHub Actions workflows
├── docker-compose.yml # Local development database
├── .gitignore
├── LICENSE
└── README.md
```

### Naming Rules

| Item | Convention | Example |
|:-----|:-----------|:--------|
| Folders | `kebab-case` | `product-management/` |
| Files (components) | `PascalCase.tsx` | `ProductCard.tsx` |
| Files (other) | `kebab-case.ts` | `auth.service.ts` |
| Files (styles) | `kebab-case.css` | `pos-screen.css` |
| React Components | `PascalCase` | `ProductCard`, `CartItem` |
| React Hooks | `camelCase` with `use` prefix | `useProducts`, `useCart` |
| API Functions | `camelCase` | `fetchProducts`, `createSale` |
| Types/Interfaces | `PascalCase` | `Product`, `SaleItem` |
| Backend Services | `PascalCase` + `Service` suffix | `ProductsService` |
| Backend Controllers | `PascalCase` + `Controller` suffix | `ProductsController` |
| Backend DTOs | `PascalCase` + `Dto` suffix | `CreateProductDto` |
| Prisma Models | `PascalCase` | `Product`, `SaleItem` |
| API Endpoints | `kebab-case` | `/api/low-stock` |
| Environment Variables | `SCREAMING_SNAKE_CASE` | `DATABASE_URL` |

---

## 2. Git Workflow

### Branch Strategy
```
main (production)
├── develop (integration)
│   ├── feature/auth-module
│   ├── feature/product-crud
│   ├── feature/pos-checkout
│   ├── feature/offline-sync
│   └── bugfix/stock-calculation
└── hotfix/critical-security
```

### Branch Naming
| Type | Pattern | Example |
|:-----|:--------|:--------|
| Feature | `feature/{short-description}` | `feature/product-crud` |
| Bug fix | `bugfix/{short-description}` | `bugfix/stock-deduction` |
| Hotfix | `hotfix/{short-description}` | `hotfix/jwt-validation` |
| Documentation | `docs/{short-description}` | `docs/api-documentation` |

### Commit Message Convention
```
<type>(<scope>): <short description>

<body - optional>

<footer - optional>
```

**Types:**
| Type | When to Use |
|:-----|:------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code change that neither fixes nor adds |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies |
| `perf` | Performance improvement |

**Examples:**
```
feat(products): add product CRUD endpoints
fix(inventory): prevent negative stock on concurrent sales
docs(api): add checkout endpoint documentation
test(sales): add checkout service unit tests
chore(deps): update Prisma to 5.14
```

### Pull Request Rules
1. All development happens on feature branches
2. PR targets `develop` (not `main`)
3. PR must pass CI (lint, typecheck, tests)
4. PR requires at least 1 review (or self-merge for solo dev)
5. Squash merge to keep history clean
6. Delete branch after merge

---

## 3. Code Style Standards

### TypeScript Configuration
```json
// Shared tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### Frontend Code Style

| Rule | Standard |
|:-----|:---------|
| Component definition | Functional components only (no class components) |
| State management | Zustand for client state, TanStack Query for server state |
| Styling | Tailwind CSS utility classes; no inline styles |
| Component structure | One component per file; co-locate related files |
| Props | Use TypeScript interfaces; destructure in function params |
| Side effects | useEffect with proper cleanup |
| Forms | Controlled components with React Hook Form (if needed) |

### Backend Code Style

| Rule | Standard |
|:-----|:---------|
| NestJS patterns | Controller → Service → Prisma (strict layers) |
| DTOs | Use `class-validator` decorators on all DTOs |
| Guards | Auth guard on all routes (except login/register) |
| Error handling | Use NestJS built-in exceptions; no try-catch swallowing |
| Database queries | Prisma only; no raw SQL unless absolutely necessary |
| Transactions | Use Prisma `$transaction` for multi-step operations |

---

## 4. Error Handling Strategy

### Frontend Errors
```typescript
// API Error Handler Pattern
const apiClient = {
  async request<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new ApiError(error.statusCode, error.message);
    }

    return response.json();
  }
};

// React Error Boundary
<ErrorBoundary fallback={<ErrorScreen />}>
  <App />
</ErrorBoundary>
```

### Backend Errors
```typescript
// NestJS Exception Filter
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception instanceof HttpException
        ? exception.message
        : 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
}
```

### Error Types
| Error | HTTP Status | Message |
|:------|:------------|:--------|
| Validation error | 400 | Specific field errors |
| Unauthorized | 401 | "Invalid credentials" or "Token expired" |
| Forbidden | 403 | "Insufficient permissions" |
| Not found | 404 | "Resource not found" |
| Conflict | 409 | "Resource already exists" |
| Server error | 500 | "Internal server error" |

---

## 5. Validation Strategy

### Frontend Validation
- Form-level validation before submission
- Real-time validation on blur
- Visual error messages below each field
- Disable submit button until form is valid

### Backend Validation
- All DTOs validated with `class-validator` decorators
- Validation pipe runs on every request
- Business rules validated in service layer
- Database constraints as last resort

### Validation Rules

| Field | Rules |
|:------|:------|
| Email | Valid email format, unique per tenant |
| Password | Min 8 chars, at least 1 number |
| Product name | Required, max 200 chars |
| Price | Positive number |
| Quantity | Positive integer |
| Phone | Valid format (Ethiopian numbers: +251...) |
| SKU | Optional, unique per tenant |

---

## 6. Security Standards

### Authentication
| Standard | Implementation |
|:---------|:---------------|
| Password storage | bcrypt with 12 salt rounds |
| Token type | JWT (HS256) |
| Token expiry | 24 hours |
| Token storage | localStorage (client) |
| Token transmission | Authorization: Bearer header |
| CORS | Restricted to frontend origin only |

### Data Protection
| Standard | Implementation |
|:---------|:---------------|
| HTTPS | Enforced in production |
| Input sanitization | class-validator + Prisma parameterized queries |
| SQL injection | Prisma ORM (no raw queries) |
| XSS | React auto-escaping + Content Security Policy |
| CSRF | SameSite cookie + JWT (stateless) |
| Rate limiting | 100 requests/minute per user |
| Sensitive data | Never log passwords, tokens, or full card numbers |

### Tenant Isolation
| Standard | Implementation |
|:---------|:---------------|
| Query filtering | Prisma middleware adds tenantId to all queries |
| API isolation | Every endpoint validates tenantId from JWT |
| Database level | Foreign key constraints with cascade delete |
| No cross-tenant access | Impossible to query another tenant's data |

---

## 7. Testing Strategy

### Test Types
| Type | Tool | Coverage Target | Priority |
|:-----|:-----|:----------------|:---------|
| Unit tests | Jest | 80% service logic | P0 |
| Integration tests | Jest + Supertest | All API endpoints | P0 |
| E2E tests | Playwright | Critical user flows | P1 |
| Component tests | React Testing Library | UI components | P2 |

### Testing Rules
1. Every service method must have at least 1 unit test
2. Every API endpoint must have integration test
3. Tests run in CI before merge
4. No `console.log` in test output
5. Test files co-located: `product.service.spec.ts`

---

## 8. Documentation Standards

### Code Documentation
| Type | Standard |
|:-----|:---------|
| Comments | Minimal; code should be self-documenting |
| TODO format | `// TODO(username): description` |
| Fixme format | `// FIXME(username): description` |
| API docs | Generated from Swagger decorators (NestJS) |
| README files | One per module, explaining purpose and setup |

### Documentation Files
| File | Audience | Update Frequency |
|:-----|:---------|:-----------------|
| README.md | All | Every feature |
| architecture.md | Developers | Major changes only |
| api-documentation.md | Frontend devs | Every API change |
| database-design.md | Backend devs | Schema changes |
| deployment.md | DevOps | Infrastructure changes |
| user-guide.md | End users | Major features |

---

## 9. Performance Standards

### Frontend
| Metric | Target | Measurement |
|:-------|:-------|:------------|
| Bundle size (gzipped) | < 200KB | Vite build output |
| First Contentful Paint | < 1.5s | Lighthouse |
| Time to Interactive | < 3s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |

### Backend
| Metric | Target | Measurement |
|:-------|:-------|:------------|
| API response (p95) | < 200ms | APM monitoring |
| Database query (p95) | < 50ms | Prisma tracing |
| Memory usage | < 512MB | Process monitoring |
| CPU usage | < 70% average | Container metrics |

---

## 10. Git Hooks (Husky)

```bash
# Pre-commit: Lint and format
npm run lint
npm run format

# Pre-push: Type check and test
npm run typecheck
npm run test

# Commit-msg: Validate conventional commits
npx commitlint --edit
```
