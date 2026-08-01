# SmartBiz ERP Lite

A production-ready SaaS-style ERP Progressive Web Application designed for Small and Medium Businesses (SMEs) in Ethiopia.

> **Phase:** Planning & Architecture (Phase 1 Complete)
> **Status:** Ready for Implementation

---

## Vision

Every Ethiopian shop owner should have the operational intelligence of a corporation, delivered through a tool as simple as WhatsApp.

---

## Features

- Product and Inventory Management
- Accurate Pricing Calculation (base cost + overhead = landed cost)
- Sales Management (Point of Sale)
- Customer Credit Tracking
- Offline-first PWA (works without internet)
- Multi-tenant SaaS architecture

---

## Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **Frontend** | React 19, TanStack Router, Tailwind CSS, Shadcn UI | PWA user interface |
| **Backend** | NestJS, Prisma ORM | REST API server |
| **Database** | PostgreSQL 15 | Multi-tenant data storage |
| **Deployment** | Vercel (frontend), Railway (backend) | Production hosting |

---

## Documentation

All project documentation is in the `docs/` folder:

| Document | Description |
|:---------|:------------|
| [PRD.md](docs/PRD.md) | Product Requirements Document |
| [user-stories.md](docs/user-stories.md) | User stories with acceptance criteria |
| [mvp-scope.md](docs/mvp-scope.md) | MVP feature prioritization |
| [architecture.md](docs/architecture.md) | System architecture and design |
| [module-breakdown.md](docs/module-breakdown.md) | Module definitions and dependencies |
| [rbac-matrix.md](docs/rbac-matrix.md) | Role-based access control |
| [application-flow.md](docs/application-flow.md) | User journey flows |
| [engineering-standards.md](docs/engineering-standards.md) | Code standards and workflow |
| [database-design.md](docs/database-design.md) | Prisma schema and ERD |
| [api-documentation.md](docs/api-documentation.md) | REST API reference |
| [deployment.md](docs/deployment.md) | Deployment and DevOps |
| [development-roadmap.md](docs/development-roadmap.md) | Implementation timeline |
| [roadmap.md](docs/roadmap.md) | Documentation plan |

---

## User Roles

| Role | Access Level |
|:-----|:-------------|
| **Owner** | Full system access — manages staff, products, reports |
| **Manager** | Operational access — processes sales, manages inventory |
| **Cashier** | Transactional access — processes sales, looks up products |

---

## Development Status

- [x] Phase 1: Planning & Architecture
- [ ] Phase 2: MVP Implementation (2-week sprint)
- [ ] Phase 3: Feature Enhancement
- [ ] Phase 4: SaaS Preparation

---

## Getting Started

> Implementation has not begun yet. This repository currently contains only planning documentation.

Once implementation begins:
```bash
# Clone the repository
git clone https://github.com/your-org/smartbiz-erp-lite.git

# Start local development
docker-compose up -d          # Start PostgreSQL
cd backend && npm install     # Install backend dependencies
cd frontend && npm install    # Install frontend dependencies

# Run development servers
cd backend && npm run dev     # Backend on :3000
cd frontend && npm run dev    # Frontend on :5173
```

---

## License

Private — SmartBiz ERP Lite
