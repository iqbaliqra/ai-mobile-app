import { Router } from "express";
import { geminiGenerate, geminiTest } from "../controllers/gemini.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.get("/test", requireAuth, geminiTest);
router.post("/generate", requireAuth, geminiGenerate);

export default router;
