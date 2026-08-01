# Documentation Plan
## SmartBiz ERP Lite

---

## Documentation Structure

```
docs/
├── roadmap.md                          # This file
├── 01-planning/
│   ├── PRD.md                          # Product Requirements Document
│   ├── user-stories.md                 # User stories with acceptance criteria
│   ├── mvp-scope.md                    # MVP feature prioritization
│   ├── module-breakdown.md             # Module definitions and dependencies
│   ├── rbac-matrix.md                  # Role-based access control
│   ├── application-flow.md             # User journey flows
│   ├── engineering-standards.md        # Code standards and workflow
│   ├── api-documentation.md            # REST API reference
│   ├── deployment.md                   # Deployment and DevOps
│   └── development-roadmap.md          # Implementation timeline
├── 02-design/
│   ├── architecture.md                 # System architecture
│   ├── database-design/
│   │   ├── 01-domain-analysis.md       # Entities, relationships, data types
│   │   ├── 02-table-design.md          # All table schemas
│   │   ├── 03-prisma-schema.md         # Copy-paste ready Prisma schema
│   │   ├── 04-er-diagrams.md           # Mermaid ER diagrams
│   │   └── 05-performance.md           # Indexing, queries, security, backup
│   └── ux-ui-design/
│       ├── 01-design-system.md         # Colors, typography, spacing, components
│       ├── 02-layouts.md               # App layouts and navigation
│       ├── 03-pages.md                 # Page structures
│       ├── 04-journeys.md              # User journeys
│       └── 05-responsive-accessibility.md
├── 03-implementation/                  # Empty (Phase 3)
└── user-guide.md                       # End-user docs (Phase 2)
```

---

## Document Details

| Document | Purpose | Audience | Maintenance |
|:---------|:--------|:---------|:------------|
| **PRD.md** | Single source of truth for requirements | Product owner, devs | On requirement changes |
| **user-stories.md** | Stories per role with acceptance criteria | Devs, QA | On feature changes |
| **mvp-scope.md** | Scope boundaries for 2-week sprint | Devs, PM | Frozen after sprint planning |
| **architecture.md** | Technical architecture decisions | Devs, tech lead | On architecture changes |
| **module-breakdown.md** | Module definitions + dependencies | Devs | On module changes |
| **rbac-matrix.md** | Permission matrix for all roles | Devs, security | On resource/permission changes |
| **application-flow.md** | Step-by-step user journeys | Devs, UX, QA | On flow changes |
| **engineering-standards.md** | Code quality, workflow, security | Devs | Monthly |
| **database-design/** | Schema, ERD, indexing, Prisma | Backend devs | On schema changes |
| **ux-ui-design/** | Design system, layouts, pages | Devs, designers | On design changes |
| **api-documentation.md** | REST API reference | Frontend devs | Every sprint |
| **deployment.md** | Infrastructure, CI/CD | DevOps, devs | On infra changes |
| **development-roadmap.md** | Timeline + milestones | PM, devs | Weekly during dev |
| **user-guide.md** | End-user documentation | End users | Per release (Phase 2) |

---

## Documentation Standards

1. Use clear, concise language
2. Include code examples where helpful
3. Use Mermaid diagrams for architecture/flows
4. Keep tables for structured data
5. Link between related documents
6. All docs tracked in git; changes via PR review

### Review Cycle
| Document | Frequency |
|:---------|:----------|
| PRD | Weekly during planning |
| Architecture | On major changes |
| API docs | Every sprint |
| Engineering standards | Monthly |
| User guide | Per release |
