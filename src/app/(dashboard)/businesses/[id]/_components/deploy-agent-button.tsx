"use client"

import { useTransition } from "react"
import { deployAgent } from "@/app/actions/voice"
import { Loader2, Mic } from "lucide-react"

export function DeployAgentButton({ businessId }: { businessId: string }) {
    const [isPending, startTransition] = useTransition()

    const handleDeploy = () => {
        startTransition(async () => {
            const result = await deployAgent(businessId)
            if (result.error) {
                alert("Failed to deploy agent: " + result.error) // Simple alert for MVP
            } else {
                alert("Agent deployed successfully!")
            }
        })
    }

    return (
        <button
            onClick={handleDeploy}
            disabled={isPending}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
        >
            {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <Mic className="h-4 w-4" />
            )}
            {isPending ? "Deploying..." : "Deploy Agent"}
        </button>
    )
}
