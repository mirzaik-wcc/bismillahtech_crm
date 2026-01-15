import jwt from "jsonwebtoken"
import axios from "axios"

interface VoximplantConfig {
    accountId: string
    keyId: string
    privateKey: string
}

export class VoximplantManagementClient {
    private config: VoximplantConfig
    private token: string | null = null
    private tokenExpiry: number = 0
    private apiBase = "https://api.voximplant.com/platform_api"

    constructor(config: VoximplantConfig) {
        this.config = config
    }

    private validateConfig() {
        if (!this.config.accountId || !this.config.keyId || !this.config.privateKey) {
            throw new Error("Voximplant credentials missing. Check environment variables.")
        }
    }

    private async getToken(): Promise<string> {
        this.validateConfig()

        // Return existing token if valid (providing 60s buffer)
        if (this.token && Date.now() / 1000 < this.tokenExpiry - 60) {
            return this.token
        }

        const payload = {
            iss: this.config.accountId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
        }

        const token = jwt.sign(payload, this.config.privateKey, {
            algorithm: "RS256",
            header: { kid: this.config.keyId, alg: "RS256" }
        })

        this.token = token
        this.tokenExpiry = payload.exp
        return token
    }

    private async request(method: string, params: Record<string, any> = {}) {
        const token = await this.getToken()
        // Append Authorization header for modern API or use request params if strictly required. 
        // Voximplant Management API typically takes everything as URL params or Body params with access_token?
        // Looking at docs: "Authorization: Bearer <token>" is standard for JWT.
        // The key file link points to Service Account docs. Usually it's /Auth/LoginWithToken or Bearer.
        // Actually, for Service Accounts, we use the JWT as the Bearer token directly.

        try {
            const response = await axios.get(`${this.apiBase}/${method}`, {
                params: {
                    ...params
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.error) {
                throw new Error(JSON.stringify(response.data.error))
            }

            return response.data
        } catch (error: any) {
            console.error(`[Voximplant] API Error (${method}):`, error.response?.data || error.message)
            throw error
        }
    }

    // --- Management Methods ---

    async createApplication(appName: string) {
        // Check if exists first? Or just try create.
        // GetApplications
        const apps = await this.request("GetApplications", { application_name: appName })
        if (apps.result && apps.result.length > 0) {
            return apps.result[0].application_id
        }

        const res = await this.request("AddApplication", { application_name: appName })
        return res.application_id
    }

    async setScenario(scenarioName: string, scriptCode: string) {
        // Check if exists
        const scenarios = await this.request("GetScenarios", { scenario_name: scenarioName })
        let scenarioId

        if (scenarios.result && scenarios.result.length > 0) {
            scenarioId = scenarios.result[0].scenario_id
            // Update
            await this.request("SetScenarioInfo", {
                scenario_id: scenarioId,
                scenario_script: scriptCode
            })
        } else {
            // Create
            const res = await this.request("AddScenario", {
                scenario_name: scenarioName,
                scenario_script: scriptCode
            })
            scenarioId = res.scenario_id
        }
        return scenarioId
    }

    async bindRule(appId: number, scenarioId: number, ruleName: string, pattern: string = ".*") {
        // Check rules
        const rules = await this.request("GetRoutingRules", {
            application_id: appId,
            rule_name: ruleName
        })

        if (rules.result && rules.result.length > 0) {
            // Update? Usually just ensure it points to the right scenario
            // For MVP we assume it's fine or we over-write
            const ruleId = rules.result[0].rule_id
            await this.request("SetRoutingRuleInfo", {
                rule_id: ruleId,
                scenario_lists: scenarioId // format: scenario_id1;scenario_id2
            })
            return ruleId
        } else {
            const res = await this.request("AddRoutingRule", {
                application_id: appId,
                rule_name: ruleName,
                rule_pattern: pattern,
                scenario_lists: scenarioId
            })
            return res.rule_id
        }
    }
}
