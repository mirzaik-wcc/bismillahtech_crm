import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { from, to, callId } = body

        // Initialize Supabase Admin Client (to bypass RLS for system lookup)
        // Note: For MVP we use the anon key but on a protected route or environment 
        // that allows reading. Ideally we use a SERVICE_ROLE key here.
        // But for "Zero Setup", we'll just use the regular client and assume RLS allows public read 
        // OR we just return default if we can't look it up without auth.

        // BETTER MVP: Just use the environment variables as fallback, but TRY to find a business
        // However, we don't know WHICH business "to" belongs to without a stored mapping.
        // Assumption: Users will manually update the script with business logic OR
        // we just return the hardcoded prompt for now with a comment explaining the limitation.

        // Actually, to make T040 work ("Dynamic Prompt from DB"), we need to query.
        // We'll simulate fetching the "first active business" configured for this number, 
        // OR just fetch the config passed in headers if Voximplant supported it.

        // Since we can't easily map Phone -> Business yet (no table col for phone),
        // We will default to the ENV VARS but allow an override if a 'businessId' query param is passed.
        // The Voximplant scenario can append ?businessId=...

        const url = new URL(req.url)
        const businessId = url.searchParams.get("businessId")

        let config = {
            apiKey: process.env.DEEPGRAM_API_KEY,
            systemPrompt: "You are a helpful AI assistant for BismillahTech Consulting.",
            voiceId: "aura-asteria-en"
        }

        if (businessId) {
            const supabase = await createClient() // Server client
            const { data: business } = await supabase
                .from("businesses")
                .select("voice_config")
                .eq("id", businessId)
                .single()

            if (business?.voice_config) {
                config.systemPrompt = (business.voice_config as any).prompt || config.systemPrompt
                config.voiceId = (business.voice_config as any).voiceId || config.voiceId
            }
        }

        return NextResponse.json({
            deepgramConfig: config
        })

    } catch (error: any) {
        console.error("Config Fetch Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
