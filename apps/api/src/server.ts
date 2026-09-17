import "dotenv/config";
import cors from "cors";
import express from "express";
import authRoutes from "./routes/auth.routes";
import geminiRoutes from "./routes/gemini.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/gemini", geminiRoutes);

app.get("/", (_req, res) => {
  res.json({
    message: "AI Mobile API is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
