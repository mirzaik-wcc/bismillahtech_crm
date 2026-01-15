import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { from, to, callId } = body

        // TODO: Lookup business by 'to' number
        // const business = await findBusinessByPhoneNumber(to)

        // For MVP, we return a default configuration using environment variables
        // This allows the scenario to work immediately with the backend acting as a secure proxy for the key.

        return NextResponse.json({
            deepgramConfig: {
                apiKey: process.env.DEEPGRAM_API_KEY,
                systemPrompt: "You are a helpful AI assistant for BismillahTech Consulting. You help clients with scheduling and inquiry details. Be professional, concise, and friendly.",
                voiceId: "aura-asteria-en",
                // Setup Tools here if needed (e.g. createLead)
                tools: [
                    // Example Tool Definition
                    /*
                    {
                       function: {
                           name: "bookMeeting",
                           description: "Book a meeting with a consultant",
                           parameters: { type: "object", properties: { ... } },
                           url: `https://${req.headers.get("host")}/api/voice/tools/book-meeting` 
                       }
                    }
                    */
                ]
            }
        })

    } catch (error: any) {
        console.error("Config Fetch Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
