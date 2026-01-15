import { createClient } from "@/lib/supabase/server"

export async function recordActivity(
    businessId: string,
    type: 'call' | 'email' | 'lead_form',
    direction: 'inbound' | 'outbound',
    metadata: Record<string, any>
) {
    const supabase = await createClient()

    // 1. Record Activity
    const { data: activity, error: activityError } = await supabase
        .from("activities")
        .insert({
            business_id: businessId,
            type,
            direction,
            metadata
        })
        .select()
        .single()

    if (activityError) {
        console.error("Error recording activity:", activityError)
        throw activityError
    }

    // 2. Detect Leaks (Simple Logic)
    // Logic: Inbound Call that was missed (status != 'connected' or duration < 5s)
    // This logic depends on the specific metadata format from Voximplant
    const isMissedCall =
        type === 'call' &&
        direction === 'inbound' &&
        (metadata.status === 'missed' || metadata.duration < 5)

    if (isMissedCall) {
        await supabase.from("leaks").insert({
            business_id: businessId,
            activity_id: activity.id,
            type: 'missed_call',
            status: 'detected',
            potential_value: 0, // Placeholder, normally calculated based on business Avg Job Value
        })
    }

    return activity
}
