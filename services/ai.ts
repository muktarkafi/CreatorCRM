import { GoogleGenAI } from "@google/genai";

const LS_KEY = 'reachmora_api_key';
const DEFAULT_KEY = 'AIzaSyD3Slqu1or8ihF39lh4hpG1KQA_cpAO2iI'; 

export const getApiKey = () => {
    return localStorage.getItem(LS_KEY) || process.env.API_KEY || DEFAULT_KEY;
};

export const AIService = {
    improveScript: async (rawScript: string, title: string, brandName: string): Promise<string> => {
        const apiKey = getApiKey();
        
        if (!apiKey) {
            throw new Error("API Key is missing. Please add it in Settings.");
        }

        try {
            const ai = new GoogleGenAI({ apiKey });
            
            const systemInstruction = `
                You are the ReachMora Script Optimizer. 
                Your task is to rewrite raw, manually written video scripts into a high-retention, natural-sounding voiceover style.
                
                REACHMORA STYLE RULES:
                1. Tone: Conversational, professional, human, and authoritative yet accessible.
                2. Structure: Written in paragraphs ready for a single-take voiceover.
                3. Flow: Use natural transitions.
                4. ElevenLabs Optimization: Use "..." for short natural pauses. Use commas and periods strategically for vocal emphasis. 
                5. Preservation: DO NOT change the technical details, tool names, or the core message of the user. Only improve the "soul" and flow of the delivery.
                6. Length: Keep the duration similar to the input unless it's clearly too wordy.
            `;

            const prompt = `
                TITLE: ${title}
                BRAND: ${brandName}
                RAW SCRIPT:
                """
                ${rawScript}
                """

                Please improve this script using the ReachMora style described above.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
                config: {
                    systemInstruction: systemInstruction,
                    temperature: 0.7,
                }
            });

            return response.text || "Could not optimize script.";
        } catch (error: any) {
            console.error("AI Optimization Error:", error);
            if (error.message?.includes('403') || error.message?.includes('key')) {
                throw new Error("Invalid API Key. Please check Settings.");
            }
            throw new Error("Failed to optimize script. Please try again.");
        }
    }
};