# Implementation Plan: Consulting-First CRM Platform (MVP)

**Branch**: `001-consulting-crm-os` | **Date**: 2026-01-14 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-consulting-crm-os/spec.md`

## Summary

Initialize the "Consulting-First CRM" repository as a modern web application using Next.js and Supabase. This establishes the foundation for the "Operating System" architecture (FR-005) and multi-tenancy (FR-001). We will scaffold the application, configure the design system (Tailwind CSS), and set up the authentication/database layer (Supabase) to support User Story 1 (Onboarding).

## Technical Context

**Language/Version**: TypeScript 5.0+
**Framework**: Next.js 15 (App Router)
**Primary Dependencies**: 
- `@supabase/ssr` (Auth & Data)
- `lucide-react` (Icons)
- `zod` (Validation)
- `axios` (API Requests to Voximplant)
- *External*: VoxEngine (JavaScript-like runtime for Voice)
**Storage**: PostgreSQL (via Supabase)
**Testing**: Jest + React Testing Library (Unit), Playwright (E2E - setup only)
**Target Platform**: Web (Responsive)
**Project Type**: Web Application
**Performance Goals**: < 1.0s LCP (Next.js 15), < 200ms TBT 

## Constitution Check

- **I. User-Centric Design**: Next.js + Tailwind allows for high-quality, responsive UI (SC-001).
- **II. Data Integrity**: Supabase (PostgreSQL) provides strong ACID compliance and RLS (Row Level Security) for multi-tenancy (FR-001).
- **III. Modular Architecture**: "OS" structure (Solution Modules) will be supported by independent directory components (FR-005).
- **IV. Test Coverage**: Jest and Playwright harnesses will be installed.
- **V. Documentation**: README and inline documentation will be established.

## Project Structure

### Documentation (this feature)

```text
specs/001-consulting-crm-os/
├── plan.md              # This file
├── research.md          # Technical research and decisions
├── data-model.md        # Schema definitions and RLS policies
├── quickstart.md        # Development setup guide
├── tasks.md             # Detailed execution checklist (Phase 2)
├── contracts/           # API contracts (placeholder)
└── spec.md              # Feature Specification
```

### Source Code
```text
src/
├── app/                 # Next.js App Router (Pages & Layouts)
│   ├── (auth)/          # Authentication Routes
│   ├── (dashboard)/     # Main App Area (Multi-tenant)
│   └── page.tsx         # / Landing Page
├── components/
│   ├── ui/              # Reusable Design System Components
│   └── layout/          # Shells, Sidebars, Navbars
├── lib/
│   ├── supabase/        # Database Client
│   └── utils.ts         # Helpers
└── types/               # TypeScript Definitions
```

## Verification Plan

### Automated Tests
- Run `npm run build` to verify type safety and build integrity.
- Run `npm test` to verify unit test harness.
- Run `npx playwright test` to verify E2E harness.

### Manual Verification
- **Installation**: Verify `npm install` completes without peer dependency warnings.
- **Dev Server**: Verify `npm run dev` starts the server on port 3000.
- **Supabase**: Verify connection by logging a test query result to the console.
- **UI**: Visually inspect the Landing Page and Dashboard Layout for responsiveness.