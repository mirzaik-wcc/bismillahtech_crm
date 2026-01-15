# Data Model: Consulting-First CRM

## Conceptual Schema

### Entities

1.  **Organization (Tenant)**: Represents the Consulting Agency.
    *   `id`: UUID (PK)
    *   `name`: String
    *   `slug`: String (unique)
    *   `created_at`: Timestamptz

2.  **UserProfile**: A user in the system (Consultant).
    *   `id`: UUID (PK, references auth.users)
    *   `organization_id`: UUID (FK)
    *   `full_name`: String
    *   `role`: Enum (admin, consultant)

3.  **Business (Client)**: A client service business owned by the Agency.
    *   `id`: UUID (PK)
    *   `organization_id`: UUID (FK)
    *   `name`: String
    *   `timezone`: String
    *   `status`: Enum (active, onboarding, churned)
    *   `crm_mode`: Enum (internal_only, hybrid, external_only) - **CRITICAL**: Determines if we are the operational CRM or just the consulting ledger.

4.  **Activity**: A raw event stream item (Call, Email, etc.).
    *   `id`: UUID (PK)
    *   `business_id`: UUID (FK)
    *   `type`: Enum (call, email, lead_form)
    *   `direction`: Enum (inbound, outbound)
    *   `metadata`: JSONB (stores provider specific data like duration, recording_url)
    *   `occurred_at`: Timestamptz

5.  **Leak**: A detected revenue leak.
    *   `id`: UUID (PK)
    *   `business_id`: UUID (FK)
    *   `activity_id`: UUID (FK, optional)
    *   `type`: Enum (missed_call, unreplied_email)
    *   `status`: Enum (detected, ignored, fixing, fixed)
    *   `potential_value`: Decimal

## Supabase Implementation

### Tables & RLS

*   All tables (except `Organization`) will have a `organization_id` column for multi-tenancy.
*   **RLS Policies**:
    *   `SELECT`: `auth.uid() IN (SELECT id FROM user_profiles WHERE organization_id = table.organization_id)`
    *   `INSERT/UPDATE`: Same check.

