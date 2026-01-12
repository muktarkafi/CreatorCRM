import { GoogleGenAI } from "@google/genai";

// 1. Check for key in Local Storage (User Settings)
// 2. Check for Environment Variable (Vercel/Hosting)
// 3. Fallback to the provided default key
const LS_KEY = 'reachmora_api_key';
const DEFAULT_KEY = 'AIzaSyD3Slqu1or8ihF39lh4hpG1KQA_cpAO2iI'; // Provided Key

export const getApiKey = () => {
    return localStorage.getItem(LS_KEY) || process.env.API_KEY || DEFAULT_KEY;
};

export const AIService = {
    generateScript: async (title: string, brandName: string, type: string): Promise<string> => {
        const apiKey = getApiKey();
        
        if (!apiKey) {
            throw new Error("API Key is missing. Please add it in Settings.");
        }

        try {
            // Initialize fresh instance with current key
            const ai = new GoogleGenAI({ apiKey });
            
            const prompt = `
                Act as a professional YouTube scriptwriter.
                Create a structured video script for a ${type} video.
                
                Title: ${title}
                Brand/Topic: ${brandName}

                Structure required:
                1. Hook (0-30s): Grab attention.
                2. Intro: Brief context.
                3. Main Content: Key points (bullet points).
                4. CTA/Outro: Call to action.

                Keep it concise and engaging. Return formatted Markdown.
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt,
            });

            return response.text || "Could not generate script.";
        } catch (error: any) {
            console.error("AI Generation Error:", error);
            if (error.message?.includes('403') || error.message?.includes('key')) {
                throw new Error("Invalid API Key. Please check Settings.");
            }
            throw new Error("Failed to generate script. Please try again.");
        }
    }
};