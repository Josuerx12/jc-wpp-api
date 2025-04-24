import { Request, Response, NextFunction } from "express";

export function checkUserSecret(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const userSecret = req.header("x-user-secret");

  if (!userSecret) {
    res.status(401).json({ error: "Secret não informado" });
    return;
  }

  // Você pode adicionar ao req para uso posterior
  (req as any).userSecret = userSecret;

  next();
}
