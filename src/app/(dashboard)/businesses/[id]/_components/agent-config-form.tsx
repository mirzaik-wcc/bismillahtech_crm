"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface AgentConfigFormProps {
    businessId: string
    initialConfig: {
        prompt: string
        voiceId: string
    }
}

export function AgentConfigForm({ businessId, initialConfig }: AgentConfigFormProps) {
    const [prompt, setPrompt] = useState(initialConfig.prompt)
    const [loading, setLoading] = useState(false)
    const [saved, setSaved] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleSave = async () => {
        setLoading(true)
        setSaved(false)

        const { error } = await supabase
            .from("businesses")
            .update({
                voice_config: {
                    prompt,
                    voiceId: initialConfig.voiceId // Keep voice ID static for MVP
                }
            })
            .eq("id", businessId)

        setLoading(false)

        if (!error) {
            setSaved(true)
            router.refresh()
            setTimeout(() => setSaved(false), 2000)
        } else {
            alert("Failed to save config: " + error.message)
        }
    }

    return (
        <div className="space-y-4 border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold">AI Agent Configuration</h3>
                {saved && <span className="text-sm text-green-600 font-medium">Saved!</span>}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">System Prompt</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="You are a helpful receptionist for..."
                />
                <p className="text-xs text-muted-foreground">
                    Define how the AI should behave, what information it should collect, and its tone.
                </p>
            </div>

            <button
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 w-full sm:w-auto"
            >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Configuration
            </button>
        </div>
    )
}
