import { GoogleGenAI } from "@google/genai";

function getAi() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({ apiKey });
}

export const testGemini = async () => {
  return generateFromPrompt("Say: Gemini integration is working.");
};

export const generateFromPrompt = async (prompt: string) => {
  const cleaned = prompt.trim();

  if (!cleaned) {
    throw new Error("Prompt is required");
  }

  const ai = getAi();

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: cleaned,
  });

  const text = response.text?.trim();

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return text;
};
