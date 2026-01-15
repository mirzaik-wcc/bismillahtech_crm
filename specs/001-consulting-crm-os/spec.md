# Feature Specification: Consulting-First CRM Platform

**Feature Branch**: `001-consulting-crm-os`
**Created**: 2026-01-14
**Status**: Draft
**Input**: User description...

## Concept: Consulting-First CRM
The platform is the **system of record for consulting truth**. It observes activity and fixes leaks. It supports three modes per business:
- `internal_only`: We are the operational CRM.
- `hybrid`: We are intake + measurement.
- `external_only`: We are measurement + overlay (shadow ledger).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Consultant Onboards a New Business (Priority: P1)
As a consultant, I want to onboard a new service business onto the platform, so I can start monitoring their operations and identifying revenue leaks.

**Why this priority**: This is the first step for any consultant to start using the platform and provide value to their clients.

**Independent Test**: A new business can be created in the system, and the consultant can access its dashboard.

**Acceptance Scenarios**:
1. **Given** a consultant is logged into the platform, **When** they navigate to the "Add New Business" page and fill in the required details, **Then** a new business entity is created and associated with the consultant's account.
2. **Given** a new business has been created, **When** the consultant navigates to the business's dashboard, **Then** they see a welcome message and an initial setup guide.

---

### User Story 2 - Platform Identifies Missed Call Revenue Leaks (Priority: P2)
As a consultant, I want the platform to automatically identify missed calls for my client's business, so I can quantify the potential revenue loss and propose a solution.

**Why this priority**: This demonstrates the core value proposition of the platform - identifying leaks. Missed calls are the first specified "leak".

**Independent Test**: When a call is missed, the platform records the event and flags it as a potential revenue leak.

**Acceptance Scenarios**:
1. **Given** a business has connected their telephony system, **When** an incoming call is not answered, **Then** the system records the missed call event with the caller's number, time of call, and any other available metadata.
2. **Given** a missed call has been recorded, **When** the consultant views the "Revenue Leaks" dashboard, **Then** they see the missed call listed as a potential revenue leak, with an estimated potential value.

---

### User Story 3 - Consultant Deploys AI Voice Agent to Capture Missed Calls (Priority: P3)
As a consultant, I want to deploy an AI voice agent for my client's business to handle missed calls, so that we can capture leads that would otherwise be lost.

**Why this priority**: This is the "execution" part of the platform's workflow, fixing the identified leak.

**Independent Test**: A consultant can enable the AI voice agent for a business, and when a call is missed, the agent responds and captures the caller's information.

**Acceptance Scenarios**:
1. **Given** the platform has identified missed calls as a revenue leak, **When** the consultant chooses to deploy the "AI Missed Call Agent", **Then** the agent is configured and activated for the business's phone number.
2. **Given** the AI agent is active, **When** a call is missed, **Then** the agent answers the call, interacts with the caller to capture their details and reason for calling, and saves this information as a new lead in the CRM.

### Edge Cases
- What happens if a business has multiple phone numbers?
- How does the system handle spam or robocalls?
- What if the AI voice agent cannot understand the caller?

## Requirements *(mandatory)*

### Functional Requirements
- **FR-001**: The system MUST support multiple tenants, with data isolation between different consulting agencies and their respective clients.
- **FR-002**: Consultants MUST be able to manage their client businesses through a central dashboard.
- **FR-003**: The system MUST be able to ingest business activity data from various sources, including initially: telephony, email (Gmail, Outlook), calendar/scheduling systems, and web lead forms.
- **FR-004**: The system MUST provide an analytics dashboard to visualize identified leaks and the impact of deployed solutions.
- **FR-005**: The platform MUST have an extensible architecture to allow for the addition of new "execution modules" (solutions) over time.
- **FR-006**: The AI voice agent's scripting MUST be customizable. The initial version will provide a simple text editor for consultants to write their own scripts with support for basic variables. The long-term goal is to provide an AI-powered script generator that creates effective, agentic scripts based on business information and goals.
- **FR-007**: The analytics dashboard MUST be configurable to display metrics relevant to the specific solution deployed. For example, for a "Missed Call Capture" solution, the dashboard should track the number of missed calls captured, the number of leads generated from those calls, the conversion rate of those leads, and the estimated revenue impact.
- **FR-008**: The system MUST be able to integrate with a business's existing third-party CRM, allowing solutions to be deployed without requiring the business to migrate their entire CRM to the platform.

### Key Entities *(include if feature involves data)*
- **Consultant**: A user who manages multiple service businesses.
- **Business**: A client company of a consultant, with its own users, data, and settings.
- **Activity**: An event or interaction related to a business (e.g., a call, an email, a meeting).
- **Leak**: An identified inefficiency or missed opportunity in a business's operations.
- **Solution**: An "execution module" that can be deployed to fix a leak (e.g., an AI voice agent).
- **Lead**: A potential customer captured by the system.

## Success Criteria *(mandatory)*

### Measurable Outcomes
- **SC-001**: A consultant can onboard a new business and have it ready for monitoring in under 10 minutes.
- **SC-002**: The system can successfully identify and report on at least 95% of missed calls for a connected business.
- **SC-003**: Deployment of the AI voice agent results in a 50% reduction in unhandled missed calls within the first month.
- **SC-004**: The platform can support onboarding 100 consultant agencies, each with up to 50 client businesses, without significant performance degradation.
