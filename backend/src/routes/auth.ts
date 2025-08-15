import { Router } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthSchema } from "../schemas/auth";

const router = Router();

const DEMO_USER = {
  id: "u_1",
  name: "demo",
  passwordHash: bcrypt.hashSync("password123", 10)
};

router.post("/login", (req, res) => {
  try {
    const parse = AuthSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ response: null, error: true, message: "Invalid body" });
    }
    const { name, password } = parse.data;

    if (name !== DEMO_USER.name || !bcrypt.compareSync(password, DEMO_USER.passwordHash)) {
      return res.status(401).json({ response: null, error: true, message: "Invalid credentials" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ response: null, error: true, message: "JWT secret not configured" });
    }

    const token = jwt.sign({ sub: DEMO_USER.id, name }, secret, { expiresIn: "7d" });

    return res.status(200).json({
      response: { token, user: { id: DEMO_USER.id, name } },
      error: false
    });
  } catch (error: any) {
    return res.status(500).json({ response: null, error: true, message: "Internal server error" });
  }
});

export default router;
