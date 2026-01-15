"use client"

import { useActionState } from "react"
import { createBusiness } from "@/app/actions/business"
import { Loader2 } from "lucide-react"

// Define ActionState type to handle the action response
type ActionState = {
    error?: string
    errors?: {
        name?: string[]
        timezone?: string[]
        crm_mode?: string[]
    }
}

const initialState: ActionState = {}

export function NewBusinessForm() {
    const [state, formAction, isPending] = useActionState(createBusiness, initialState)

    return (
        <form action={formAction} className="space-y-6 max-w-md">
            {state?.error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                    {state.error}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Business Name</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Acme Consulting"
                />
                {state?.errors?.name && (
                    <p className="text-xs text-destructive">{state.errors.name[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="crm_mode" className="text-sm font-medium">CRM Mode</label>
                <select
                    id="crm_mode"
                    name="crm_mode"
                    required
                    defaultValue="internal_only"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="internal_only">Internal Only (Operational CRM)</option>
                    <option value="hybrid">Hybrid (Intake + Measurement)</option>
                    <option value="external_only">External Only (Shadow Ledger)</option>
                </select>
                <p className="text-xs text-muted-foreground">
                    Determines how we interact with the client's existing tools.
                </p>
                {state?.errors?.crm_mode && (
                    <p className="text-xs text-destructive">{state.errors.crm_mode[0]}</p>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="timezone" className="text-sm font-medium">Timezone</label>
                <select
                    id="timezone"
                    name="timezone"
                    defaultValue="UTC"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">Eastern Time (US)</option>
                    <option value="America/Chicago">Central Time (US)</option>
                    <option value="America/Los_Angeles">Pacific Time (US)</option>
                    <option value="Europe/London">London</option>
                </select>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                    </>
                ) : (
                    "Onboard Business"
                )}
            </button>
        </form>
    )
}
