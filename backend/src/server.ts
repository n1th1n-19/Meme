import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import memeRoute from "./routes/meme";
import authRoute from "./routes/auth";

dotenv.config();

const app = express();

const healthCheck = {
    status: 200, 
    message: "OK" 
};

// CORS for local dev (Next.js on :3000 -> server on :4000)
app.use(cors({ origin: ["http://localhost:3000"], credentials: false }));
app.use(express.json());

// Health check
app.get("/api/health", (_req, res) => {
  res.json(healthCheck);
});

// Auth endpoints
app.use("/api/auth", authRoute);

// Meme endpoint
app.use("/api/meme", memeRoute);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
