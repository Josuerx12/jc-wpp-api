import { Request, Response, NextFunction } from "express";
import { UserSecretRepository } from "../../../core/user/infra/repositories/user-secret.repository";

export async function checkSecret(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const repo = new UserSecretRepository();

  const secret = req.headers["secret"];

  if (!secret) {
    res.status(401).json({ error: "Secret não informado." });
    return;
  }

  try {
    const userSecret = await repo.getBySecret(secret as string);

    if (!userSecret) {
      res.status(401).json({ error: "Secret inválido." });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ error: "Secret inválido." });
  }
}
