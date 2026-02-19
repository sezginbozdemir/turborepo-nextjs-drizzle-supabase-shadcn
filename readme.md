# Full‑Stack Monorepo Boilerplate

This repository provides a structured, scalable foundation for full-stack development.
It brings together a Next.js frontend, an Express backend and a set of shared packages,
all managed within a single Turborepo monorepo.

---

## Project Structure

### apps/

- **web** — Next.js frontend
- **api** — Express backend

### packages/

- **database** — Drizzle schema and database utilities
- **mailer** — Email utilities (template + sender logic)
- **shared** — Shared utilities and logic between apps
- **typescript-config** — tsconfig base configuration
- **ui** — Reusable UI components (shadcn/ui)
- **vitest-config** — Shared Vitest configuration

---

## Purpose

This boilerplate is meant to serve as a clean starting point for full‑stack projects with shared code, modular architecture, and modern tooling.

---

## Further Documentation

Refer to the readme of each directory under `apps/` and `packages/` for usage and implementation details.
