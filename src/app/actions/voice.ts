"use server"

import { voximplantService } from "@/lib/voice/voximplant"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import fs from "fs" // Server-side only
import path from "path"

export async function deployAgent(businessId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Unauthorized" }

    // Read the scenario file
    try {
        const scenarioPath = path.join(process.cwd(), "voxengine", "scenario.js")
        let scriptCode = fs.readFileSync(scenarioPath, "utf-8")

        // Dynamic URL Replacement
        // In production, use the actual domain. Locals use localhost or headers.
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
        const configUrl = `${appUrl}/api/voice/config`

        // Replace the CONFIG_URL constant in the script
        scriptCode = scriptCode.replace(
            /const CONFIG_URL = ".*";/,
            `const CONFIG_URL = "${configUrl}";`
        )

        const result = await voximplantService.deployAgent(businessId, {
            scriptCode
        })

        if (!result.success) {
            return { error: "Failed to deploy agent via Management API" }
        }

        revalidatePath(`/dashboard/businesses/${businessId}`)
        return { success: true }
    } catch (error: any) {
        console.error("Deploy Action Error:", error)
        return { error: "Deployment failed: " + error.message }
    }
}
