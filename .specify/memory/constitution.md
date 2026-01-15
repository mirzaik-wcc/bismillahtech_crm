<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- List of modified principles:
    - [PRINCIPLE_1_NAME] → I. User-Centric Design
    - [PRINCIPLE_2_NAME] → II. Data Integrity and Security
    - [PRINCIPLE_3_NAME] → III. Modular and Scalable Architecture
    - [PRINCIPLE_4_NAME] → IV. Comprehensive Test Coverage
    - [PRINCIPLE_5_NAME] → V. Thorough Documentation
- Added sections:
    - Technology Stack
    - Development Workflow
- Removed sections: None
- Templates requiring updates:
    - ✅ .specify/templates/plan-template.md
    - ✅ .specify/templates/spec-template.md
    - ✅ .specify/templates/tasks-template.md
- Follow-up TODOs:
    - TODO(TECHNOLOGY_STACK): Please review and confirm the technology stack.
-->
# BismillahTech CRM Constitution

## Core Principles

### I. User-Centric Design
The user experience is paramount. All development must prioritize ease of use, clarity, and a consistent interface.

### II. Data Integrity and Security
Customer data is our most critical asset. We must ensure its accuracy, consistency, and protection through robust validation, access control, and encryption.

### III. Modular and Scalable Architecture
The system must be built with independent, reusable modules to support future growth and easy maintenance.

### IV. Comprehensive Test Coverage
Every feature must be accompanied by a suite of unit, integration, and end-to-end tests to ensure reliability and prevent regressions.

### V. Thorough Documentation
All code, APIs, and features must be clearly documented to facilitate onboarding, maintenance, and knowledge sharing.

## Technology Stack
<!-- TODO(TECHNOLOGY_STACK): Please review and confirm the technology stack. -->
The following technology stack is to be used for all new development:
- **Frontend:** React
- **Backend:** Node.js with Express.js
- **Database:** PostgreSQL (Supabase)
- **Styling:** Tailwind CSS

## Development Workflow
The project follows a Git-Flow based workflow.
1. `main` branch is for production-ready code.
2. `develop` branch is for ongoing development.
3. Feature branches are created from `develop` for new features.
4. All feature branches must be reviewed and approved before being merged into `develop`.

## Governance
This constitution is the single source of truth for all development practices. All pull requests and code reviews must verify compliance with these principles. Any deviation must be justified and approved.

**Version**: 1.0.0 | **Ratified**: 2026-01-14 | **Last Amended**: 2026-01-14