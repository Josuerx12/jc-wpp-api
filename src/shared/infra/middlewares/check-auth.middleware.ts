import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../../../core/user/domain/entities/user.entity";
import { config } from "dotenv";
import authStorage from "../routes/auth/auth.storage";
config();

export function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers["authorization"];

  if (!token) {
    res.status(401).json({ error: "Token não informado." });
    return;
  }

  try {
    const [, extractedToken] = token.split(" ");

    const decoded = verify(
      extractedToken || token,
      process.env.SECRET as string
    );

    const user = decoded.sub as unknown as User;

    req.user = user;

    authStorage.set().user(user);

    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido." });
  }
}
