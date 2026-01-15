export interface IVoiceAgentService {
    /**
     * Deploys or updates the voice agent configuration for a business.
     * @param businessId The ID of the business.
     * @param config Configuration options (e.g., prompt, voice model).
     */
    deployAgent(businessId: string, config: { prompt: string; voiceId?: string }): Promise<{ success: boolean; deploymentId?: string }>;

    /**
     * Provisions a phone number for the agent.
     */
    provisionNumber(businessId: string, areaCode?: string): Promise<{ phoneNumber: string }>;
}
