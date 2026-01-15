"use server"

import { voximplantService } from "@/lib/voice/voximplant"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function deployAgent(businessId: string) {
    const supabase = await createClient()

    // Verify ownership
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Check business access
    // (In real app, verification logic here)

    // Default config for MVP
    const config = {
        prompt: "You are a helpful assistant.",
        voiceId: "aura-asteria-en"
    }

    const result = await voximplantService.deployAgent(businessId, config)

    if (!result.success) {
        return { error: "Failed to deploy agent" }
    }

    // Record deployment/change in activity log?
    // await recordActivity(...)

    revalidatePath(`/dashboard/businesses/${businessId}`)
    return { success: true }
}
