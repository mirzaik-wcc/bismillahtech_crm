/**
 * Voximplant + Deepgram Voice Agent Connector
 * Connects calls to Deepgram's Voice Agent API.
 */
require(Modules.Deepgram);
require(Modules.ApplicationStorage);

const DEFAULT_PROMPT = "You are a helpful assistant for a consulting firm.";

// Handle incoming calls
VoxEngine.addEventListener(AppEvents.CallAlerting, async ({ call }) => {
    let voiceAgentClient;

    try {
        call.answer();

        // Setup recording
        call.record({ hd_audio: true, stereo: true });

        // Fetch custom prompt/config from ApplicationStorage or KV
        // For MVP, we use defaults or passed headers?
        // In real app, we fetch Business Profile via HTTP or AppStorage
        const businessId = call.customData(); // Passed via SIP headers or configured in Rule

        // Settings for Deepgram
        const SETTINGS = {
            agent: {
                language: "en",
                greeting: "Hello, how can I help you today?",
                think: {
                    provider: {
                        type: "open_ai",
                        model: "gpt-4o-mini",
                    },
                    prompt: DEFAULT_PROMPT
                },
                listen: {
                    provider: { type: "deepgram", model: "nova-2" }
                },
                speak: {
                    provider: { type: "deepgram", model: "aura-asteria-en" }
                }
            }
        };

        // Create Client
        const apiKeyVal = await ApplicationStorage.get("DEEPGRAM_API_KEY");
        if (!apiKeyVal) {
            call.say("System configuration error. Deepgram key missing.");
            call.hangup();
            return;
        }

        voiceAgentClient = await Deepgram.createVoiceAgentClient({
            apiKey: apiKeyVal.value,
            settingsOptions: SETTINGS
        });

        // Bridge Audio
        VoxEngine.sendMediaBetween(call, voiceAgentClient);

        // Event Handling
        voiceAgentClient.addEventListener(Deepgram.VoiceAgentEvents.UserStartedSpeaking, () => {
            voiceAgentClient.clearMediaBuffer(); // Barge-in
        });

        // Cleanup
        call.addEventListener(CallEvents.Disconnected, () => {
            voiceAgentClient.close();
            const duration = call.duration();
            // TODO: Report back to CRM Webhook
            // reportCallToCRM(businessId, duration, 'completed');
            VoxEngine.terminate();
        });

    } catch (e) {
        Logger.write("Error: " + e);
        call.say("An error occurred.");
        VoxEngine.terminate();
    }
});

// Helper to report to CRM
// function reportCallToCRM(...) { ... }
