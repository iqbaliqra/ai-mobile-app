import { Request, Response } from "express";
import { generateFromPrompt, testGemini } from "../services/gemini.service";

function handleGeminiError(error: unknown, res: Response) {
  console.error("Gemini error:", error);

  const message =
    error instanceof Error ? error.message : "Failed to connect to Gemini";

  if (message.includes("GEMINI_API_KEY is not configured")) {
    return res.status(503).json({
      success: false,
      message: "GEMINI_API_KEY is not configured",
    });
  }

  if (message === "Prompt is required") {
    return res.status(400).json({
      success: false,
      message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Failed to connect to Gemini",
  });
}

export const geminiTest = async (_req: Request, res: Response) => {
  try {
    const response = await testGemini();

    return res.status(200).json({
      success: true,
      message: response,
    });
  } catch (error) {
    return handleGeminiError(error, res);
  }
};

export const geminiGenerate = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body ?? {};

    if (typeof prompt !== "string") {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const response = await generateFromPrompt(prompt);

    return res.status(200).json({
      success: true,
      message: response,
      user: req.user
        ? {
            id: req.user.id,
            name: req.user.name,
          }
        : undefined,
    });
  } catch (error) {
    return handleGeminiError(error, res);
  }
};
