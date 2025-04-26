import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../../../core/user/domain/entities/user.entity";

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

    req.user = decoded.sub as unknown as User;

    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido." });
  }
}
