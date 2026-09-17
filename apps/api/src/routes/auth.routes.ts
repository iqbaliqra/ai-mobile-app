import { Router } from "express";
import { getMe, loginUser } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginUser);
router.get("/me", requireAuth, getMe);

export default router;
