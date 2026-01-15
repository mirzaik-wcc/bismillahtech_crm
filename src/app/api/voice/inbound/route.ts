import { NextRequest, NextResponse } from "next/server"
import { recordActivity } from "@/lib/services/activity-service"
import { z } from "zod"

const eventSchema = z.object({
    business_id: z.string().uuid(),
    type: z.enum(['call', 'email', 'lead_form']),
    direction: z.enum(['inbound', 'outbound']),
    metadata: z.record(z.string(), z.any()),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Validate payload
        const validation = eventSchema.safeParse(body)
        if (!validation.success) {
            return NextResponse.json({ error: "Invalid payload", details: validation.error }, { status: 400 })
        }

        const { business_id, type, direction, metadata } = validation.data

        const activity = await recordActivity(business_id, type, direction, metadata)

        return NextResponse.json({ success: true, activity_id: activity.id })
    } catch (error: any) {
        console.error("Webhook Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
