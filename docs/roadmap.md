# Documentation Plan
## SmartBiz ERP Lite

This document outlines the structure, contents, and maintenance plan for all project documentation.

---

## Documentation Structure

```
docs/
├── PRD.md                    # Product Requirements Document
├── user-stories.md           # User stories with acceptance criteria
├── mvp-scope.md              # MVP feature prioritization
├── architecture.md           # System architecture
├── module-breakdown.md       # Module definitions and dependencies
├── rbac-matrix.md            # Role-based access control
├── application-flow.md       # User journey flows
├── engineering-standards.md  # Code style, git workflow, security
├── database-design.md        # Prisma schema and ERD
├── api-documentation.md      # REST API endpoints
├── deployment.md             # Deployment and DevOps
├── development-roadmap.md    # Implementation timeline
├── roadmap.md                # This file (documentation plan)
├── user-guide.md             # End-user documentation (Phase 2)
└── changelog.md              # Version history (Phase 2)
```

---

## Document Details

### 1. PRD.md
**Purpose:** Single source of truth for product requirements.
**Audience:** Product owner, developers, stakeholders.
**Contents:**
- Business problem statement
- Product vision and goals
- Target users and personas
- Functional requirements (FR-AUTH, FR-PROD, FR-POS, etc.)
- Non-functional requirements (performance, security, usability)
- Success metrics
- Constraints and assumptions
- Out-of-scope items

**Maintenance:** Updated when requirements change. Version tracked in git.

---

### 2. user-stories.md
**Purpose:** Detailed user stories for each role with acceptance criteria.
**Audience:** Developers, QA, product owner.
**Contents:**
- Stories organized by role (Owner, Manager, Cashier)
- Acceptance criteria as checklists
- Priority labels (P0, P1, P2)
- Cross-role stories

**Maintenance:** Updated when adding/modifying features. Linked to PRD.

---

### 3. mvp-scope.md
**Purpose:** Clear scope boundaries for the 2-week MVP sprint.
**Audience:** Developers, project manager.
**Contents:**
- MoSCoW prioritization framework
- MVP features with effort estimates
- Phase 2 and Phase 3 features
- Future SaaS vision
- Scope boundary rules

**Maintenance:** Frozen after sprint planning. Changes require scope approval.

---

### 4. architecture.md
**Purpose:** Technical architecture decisions and system design.
**Audience:** Developers, tech lead.
**Contents:**
- High-level architecture diagram
- Frontend architecture (React, TanStack, PWA)
- Backend architecture (NestJS, modules)
- API layer design (REST conventions, error format)
- Database layer (schema, relationships, indexing)
- Authentication and tenant isolation
- Security architecture
- Deployment architecture
- Scalability considerations

**Maintenance:** Updated when architectural decisions change. Major changes require ADR.

---

### 5. module-breakdown.md
**Purpose:** Detailed module definitions with responsibilities and dependencies.
**Audience:** Developers.
**Contents:**
- Module dependency graph
- Each module's purpose and responsibilities
- Main features with API endpoints
- Dependencies between modules
- Priority levels
- Communication patterns

**Maintenance:** Updated when adding/removing modules.

---

### 6. rbac-matrix.md
**Purpose:** Complete permission matrix for all roles.
**Audience:** Developers, security reviewers.
**Contents:**
- Role definitions
- Permission matrix (resource × action × role)
- Frontend route guards
- Backend route guards
- Data access rules
- Security implementation notes

**Maintenance:** Updated when adding new resources or changing permissions.

---

### 7. application-flow.md
**Purpose:** Step-by-step user journeys for all major operations.
**Audience:** Developers, UX designers, QA.
**Contents:**
- Application entry points
- Owner onboarding journey
- Daily operations flow (Manager)
- Cashier daily flow
- End-of-day reconciliation
- Error and edge case flows

**Maintenance:** Updated when user flows change.

---

### 8. engineering-standards.md
**Purpose:** Code quality, workflow, and security standards.
**Audience:** Developers.
**Contents:**
- Folder organization and naming conventions
- Git workflow and branch strategy
- Code style standards (frontend/backend)
- Error handling strategy
- Validation strategy
- Security standards
- Testing strategy
- Documentation standards
- Performance standards
- Git hooks

**Maintenance:** Updated when standards evolve. Team must follow.

---

### 9. database-design.md
**Purpose:** Complete database schema with Prisma.
**Audience:** Backend developers.
**Contents:**
- Multi-tenancy strategy
- Entity Relationship Diagram
- Complete Prisma schema
- Indexing strategy
- Migration guide

**Maintenance:** Updated with every schema change. Prisma migrations tracked in git.

---

### 10. api-documentation.md
**Purpose:** REST API reference for frontend-backend integration.
**Audience:** Frontend developers, API consumers.
**Contents:**
- Authentication mechanism
- All endpoints with methods, descriptions, roles
- Request/response examples
- Error format
- Pagination

**Maintenance:** Updated with every API change. Auto-generated from Swagger (Phase 2).

---

### 11. deployment.md
**Purpose:** Infrastructure, CI/CD, and deployment procedures.
**Audience:** DevOps, developers.
**Contents:**
- Local development setup (Docker)
- CI/CD pipeline (GitHub Actions)
- Production deployment (Vercel + Railway)
- Environment variables
- Release process

**Maintenance:** Updated when infrastructure changes.

---

### 12. development-roadmap.md
**Purpose:** Implementation timeline with milestones and dependencies.
**Audience:** Project manager, developers.
**Contents:**
- Phase breakdown with timelines
- Milestone definitions
- Dependency mapping
- Risk assessment
- Resource allocation

**Maintenance:** Updated weekly during development.

---

### 13. user-guide.md
**Purpose:** End-user documentation for shop owners and staff.
**Audience:** End users (non-technical).
**Contents:**
- Getting started guide
- Feature walkthroughs
- FAQ
- Troubleshooting

**Maintenance:** Updated with each major feature release. Phase 2 deliverable.

---

### 14. changelog.md
**Purpose:** Version history and release notes.
**Audience:** All stakeholders.
**Contents:**
- Version numbers (semver)
- Release dates
- Features added
- Bugs fixed
- Breaking changes

**Maintenance:** Updated with each release. Phase 2 deliverable.

---

## Documentation Standards

### Writing Guidelines
1. Use clear, concise language
2. Include code examples where helpful
3. Use diagrams for architecture decisions
4. Keep tables for structured data
5. Link between related documents

### Version Control
- All documentation tracked in git
- Changes to docs go through PR review
- Major document changes noted in commit messages

### Review Cycle
| Document | Review Frequency |
|:---------|:-----------------|
| PRD | Weekly during planning |
| Architecture | On major changes |
| API docs | Every sprint |
| Engineering standards | Monthly |
| User guide | Per release |
