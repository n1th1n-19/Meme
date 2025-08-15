import { Router } from "express";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (_req, res) => {
  try {
    const response = await fetch("https://meme-api.com/gimme", { method: "GET" });
    if (!response.ok) {
      return res.status(502).json({ error: `Upstream returned ${response.status}` });
    }
    const json = await response.json();
    return res.json({ title: json.title, imageUrl: json.url, postLink: json.postLink, subreddit: json.subreddit });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message ?? "Unknown error" });
  }
});

export default router;
