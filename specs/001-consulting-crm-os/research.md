# Research: Consulting-First CRM OS

**Feature**: `001-consulting-crm-os`
**Date**: 2026-01-14

## Technical Decisions

### Database: PostgreSQL (Supabase)
- **Decision**: Use Supabase (PostgreSQL) via `@supabase/ssr`.
- **Rationale**: 
    - **Relational Integrity**: Essential for CRM data structure.
    - **Authentication**: `auth-helpers` are deprecated; `@supabase/ssr` provides secure PKCE flow and middleware support for Next.js App Router (2025 best practice).
    - **Multi-tenancy**: RLS policies on `organization_id` are natively supported.

### Framework: Next.js 15 (App Router)
- **Decision**: Next.js 15.
- **Rationale**:
    - **Stability**: Released Oct 2024, now stable for enterprise.
    - **Performance**: Turbopack is stable (96% faster code updates), critical for rapid iteration.
    - **Caching**: "Fetch not cached by default" behavior serves dynamic CRM data better than v14's defaults.
    - **Server Actions**: Stable and mature for handling form submissions (`zod` validation).

### Styling: Tailwind CSS v3.4+
- **Decision**: Tailwind CSS v3.4 (v4 is alpha/beta, stick to v3 for stability).
- **Rationale**: 
    - **Speed/Consistency**: Mandated by Constitution.
    - **UI Library**: Compatible with `shadcn/ui` (standard for high-quality React dashboards).

### Voice AI Provider: Voximplant + Deepgram (Primary)
- **Decision**: Voximplant (Telephony/Orchestration) + Deepgram (STT/TTS/Intelligence).
- **Rationale**: 
    - **Native Integration**: VoxEngine has a native `Deepgram` module for seamless connectivity.
    - **Control**: "DIY" orchestration allows fine-tuned control over the conversation flow and "memory" (as demonstrated in user-provided code).
    - **Cost**: potentially lower infrastructure-only pricing at scale.
- **Fallback**: Vapi (if DIY orchestration becomes too complex/brittle).
- **Architecture**: **Crucial**: Implement `IVoiceAgentService` abstraction layer to allow switching between Voximplant and Vapi without refactoring the core business logic.

