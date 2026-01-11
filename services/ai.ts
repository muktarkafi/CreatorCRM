import { GoogleGenAI } from "@google/genai";

// Initialize AI Client
// Note: In a deployed environment, process.env.API_KEY would be populated.
// If running locally without a build step that injects env vars, this might fail unless manually handled.
// For the purpose of this "no-backend" app, we gracefully handle the missing key.
const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
}

export const AIService = {
    generateScript: async (title: string, brandName: string, type: string): Promise<string> => {
        if (!ai) {
            throw new Error("API Key not configured. Please deploy to Vercel/Netlify and set API_KEY.");
        }

        try {
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
        } catch (error) {
            console.error("AI Generation Error:", error);
            throw new Error("Failed to generate script. Please check your API usage.");
        }
    }
};