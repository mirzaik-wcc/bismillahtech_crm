# Execution Tasks: Consulting-First CRM OS

**Feature**: `001-consulting-crm-os`
**Total Tasks**: 16

## Dependencies
1. **Setup** (Phase 1) must complete first.
2. **Foundational** (Phase 2) must complete before any User Story.
3. **US1 -> US2 -> US3** sequential order recommended (P1 to P3).

## Phase 1: Setup
*Goal: Initialize the repository and development environment.*

- [x] T001 Initialize Next.js 15 project with TypeScript, Tailwind, ESLint in `.`
- [x] T002 Install dependencies (`@supabase/ssr`, `lucide-react`, `zod`, `axios`) in `package.json`
- [x] T003 [P] Configure Tailwind v4 tokens in `src/app/globals.css` (Adapted from `tailwind.config.ts`)
- [x] T004 Set up Supabase Client utilities in `lib/supabase/server.ts` and `lib/supabase/client.ts`

## Phase 2: Foundational
*Goal: Core data models and shared UI layout.*

- [x] T005 Create `organizations` and `user_profiles` generic tables in `lib/db/schema.sql` (or migration)
- [x] T006 Implement RLS policies for Multi-tenancy in `lib/db/policies.sql`
- [x] T007 Create Dashboard Layout shell (Sidebar, Header) in `app/(dashboard)/layout.tsx`

## Phase 3: User Story 1 (Onboarding)
*Goal: Consultant can onboard a new business. (Priority: P1)*

- [x] T008 [US1] Create `businesses` table in `lib/db/schema.sql` (Include `crm_mode`)
- [x] T009 [US1] Create `createBusiness` Server Action with Zod validation in `app/actions/business.ts` (Handle `crm_mode`)
- [x] T010 [US1] Create "New Business" Form UI in `app/(dashboard)/businesses/new/page.tsx` (Select `crm_mode`)
- [x] T011 [US1] Create "Business Dashboard" view in `app/(dashboard)/businesses/[id]/page.tsx`

## Phase 4: User Story 2 (Missed Call Leaks)
*Goal: Identify revenue leaks from missed calls. (Priority: P2)*

- [x] T012 [US2] Create `activities` and `leaks` tables in `lib/db/schema.sql`
- [x] T013 [US2] Implement `recordActivity` service in `lib/services/activity-service.ts`
- [x] T014 [US2] Create API Route for Voximplant Inbound Webhooks in `app/api/voice/inbound/route.ts`
- [x] T015 [US2] Create "Revenue Leaks" widget in `app/(dashboard)/businesses/[id]/_components/leaks-widget.tsx`

## Phase 5: User Story 3 (Voice Agent)
*Goal: Deploy Voice Agent to capture missed calls. (Priority: P3)*

- [x] T016 [US3] Create `IVoiceAgentService` abstraction in `lib/voice/interface.ts`
- [x] T017 [US3] Create VoxEngine Scenario script in `voxengine/scenario.js` (Manual Upload/Deploy)
- [x] T018 [US3] Implement `VoximplantService` (calling VoxEngine API) in `lib/voice/voximplant.ts`
- [x] T019 [US3] Connect "Deploy Agent" button in UI to `deployAgent` action in `app/actions/voice.ts`
- [x] T020 [US3] Create API Route for Voice Config in `app/api/voice/config/route.ts`
- [x] T021 [Deploy] Run local build verification (`npm run build`)
- [x] T022 [Deploy] Create `amplify.yml` build specification
- [x] T023 [Deploy] Verify `next.config.ts` settings

## Implementation Strategy
- **MVP Scope**: Complete Phase 1, 2, and 3 (US1).
- **Incremental**: Verify US1 fully (Business creation works) before starting US2.
- **Voice**: VoxEngine script (T017) is external; can be developed in parallel but requires T014 (Webhook) to be live for testing.
