/**
 * Voximplant Scenario for Consulting CRM Voice Agent
 * Matches pattern: Fetch Config -> Init Deepgram Voice Agent
 */

// TODO: Replace with your actual production URL after deployment
const CONFIG_URL = "https://your-crm-app.com/api/voice/config";

require(Modules.Deepgram);

VoxEngine.addEventListener(AppEvents.CallAlerting, async (e) => {
    let voiceAgentClient = undefined;
    const call = e.call;

    call.answer();

    const cleanup = () => {
        if (voiceAgentClient) voiceAgentClient.close();
        VoxEngine.terminate();
    };
    call.addEventListener(CallEvents.Disconnected, cleanup);
    call.addEventListener(CallEvents.Failed, cleanup);

    // 1. Fetch Configuration from CRM Backend
    const postData = JSON.stringify({
        from: call.callerid(),
        to: call.number(),
        callId: call.id()
    });

    let backendConfig;
    try {
        const response = await Net.httpRequestAsync(CONFIG_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            postData: postData
        });

        if (response.code !== 200) {
            Logger.write("Backend Error: " + response.text);
            call.say("System error connecting to agent.");
            VoxEngine.terminate();
            return;
        }

        const data = JSON.parse(response.text);
        backendConfig = data.deepgramConfig;

    } catch (err) {
        Logger.write("Config Fetch Error: " + err);
        call.say("Configuration error.");
        VoxEngine.terminate();
        return;
    }

    // 2. Prepare Deepgram Settings
    const DEEPGRAM_SETTINGS_OPTIONS = {
        "tags": ["voice_agent"],
        "agent": {
            "listen": {
                "provider": {
                    "type": "deepgram",
                    "model": "nova-3",
                    "smart_format": true
                }
            },
            "think": {
                "provider": {
                    "type": "open_ai",
                    "model": "gpt-4o-mini",
                    "temperature": 0.7
                },
                "instructions": backendConfig.systemPrompt,
                "functions": backendConfig.tools ? backendConfig.tools.map(t => ({
                    name: t.function.name,
                    description: t.function.description,
                    parameters: t.function.parameters
                })) : []
            },
            "speak": {
                "provider": {
                    "type": "deepgram",
                    "model": backendConfig.voiceId || "aura-asteria-en"
                }
            }
        }
    };

    const voiceAgentClientParameters = {
        apiKey: backendConfig.apiKey,
        settingsOptions: DEEPGRAM_SETTINGS_OPTIONS,
    };

    try {
        voiceAgentClient = await Deepgram.createVoiceAgentClient(voiceAgentClientParameters);
        VoxEngine.sendMediaBetween(call, voiceAgentClient);

        // --- Event Listeners ---
        voiceAgentClient.addEventListener(Deepgram.VoiceAgentEvents.SettingsApplied, (event) => {
            // Trigger the AI to speak first
            const injectUserMessage = {
                content: "Start the conversation.",
            };
            voiceAgentClient.sendInjectUserMessage(injectUserMessage);
        });

        voiceAgentClient.addEventListener(Deepgram.VoiceAgentEvents.UserStartedSpeaking, (event) => {
            voiceAgentClient.clearMediaBuffer();
        });

        // Handle Tool Calls (if any)
        voiceAgentClient.addEventListener(Deepgram.VoiceAgentEvents.FunctionCallRequest, async (event) => {
            const functions = event.data.payload.functions;
            for (const func of functions) {
                const toolDef = backendConfig.tools.find(t => t.function.name === func.name);
                let result = "Error: Tool not found";

                if (toolDef) {
                    try {
                        const toolResp = await Net.httpRequestAsync(toolDef.function.url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            postData: func.arguments
                        });
                        result = toolResp.text;
                    } catch (e) {
                        result = "Error executing tool: " + e.toString();
                    }
                }

                voiceAgentClient.sendFunctionCallResponse({
                    id: func.id,
                    name: func.name,
                    content: result,
                });
            }
        });

    } catch (error) {
        Logger.write('===SOMETHING_WENT_WRONG===');
        Logger.write(error);
        VoxEngine.terminate();
    }
});
