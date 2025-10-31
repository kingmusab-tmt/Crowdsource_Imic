import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Assume process.env.API_KEY is set in the environment

if (!process.env.API_KEY) {
  console.warn("API_KEY for Gemini is not set. Gemini features will be disabled.");
}

export const getFinancialInsight = async (prompt: string): Promise<string> => {
  if (!process.env.API_KEY) {
    return "Gemini API key is not configured. Please set the API_KEY environment variable.";
  }
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching from Gemini API:", error);
    if (error instanceof Error) {
      return `An error occurred while fetching insights: ${error.message}`;
    }
    return "An unknown error occurred while fetching insights.";
  }
};
