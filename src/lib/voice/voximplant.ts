import { IVoiceAgentService } from "./interface"
import { VoximplantManagementClient } from "./management-client"

export class VoximplantService implements IVoiceAgentService {
    private client: VoximplantManagementClient | null = null

    constructor() {
        const accountId = process.env.VOXIMPLANT_ACCOUNT_ID
        const keyId = process.env.VOXIMPLANT_KEY_ID
        // Support PEM directly or path (simplified for now: assume PEM in env or load from file if needed)
        // For this environment, we expect the PEM content in VOXIMPLANT_PRIVATE_KEY
        const privateKey = process.env.VOXIMPLANT_PRIVATE_KEY?.replace(/\\n/g, '\n') // Handle env var newlines

        if (accountId && keyId && privateKey) {
            this.client = new VoximplantManagementClient({
                accountId,
                keyId,
                privateKey
            })
        } else {
            console.warn("Voximplant Management API credentials missing.")
        }
    }

    async deployAgent(businessId: string, config: { prompt?: string; voiceId?: string; scriptCode?: string }): Promise<{ success: boolean; deploymentId?: string }> {
        if (!this.client) {
            console.error("Voximplant Client not initialized")
            return { success: false }
        }

        try {
            // 1. Create/Get Application
            const appId = await this.client.createApplication("consulting-crm-os")

            // 2. Create/Update Scenario
            // We expect the FULL script code to be passed in config.scriptCode
            const script = config.scriptCode || "// Default Placeholder"
            const scenarioId = await this.client.setScenario("voice-agent-scenario", script)

            // 3. Bind Rule
            const ruleId = await this.client.bindRule(appId, scenarioId, "inbound-all")

            console.log(`[Voximplant] Deployed: App=${appId}, Scenario=${scenarioId}, Rule=${ruleId}`)

            return { success: true, deploymentId: `rule_${ruleId}` }
        } catch (error) {
            console.error("Deploy Agent Error:", error)
            return { success: false }
        }
    }

    async provisionNumber(businessId: string, areaCode?: string): Promise<{ phoneNumber: string }> {
        // Mock provisioning for now, Management API also supports 'BuyPhoneNumber'
        return { phoneNumber: "+15550199" }
    }
}

export const voximplantService = new VoximplantService()
