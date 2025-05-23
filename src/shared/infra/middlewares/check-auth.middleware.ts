import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { User } from "../../../core/user/domain/entities/user.entity";
import { config } from "dotenv";
import authStorage from "../routes/auth/auth.storage";
import { UserRepository } from "../../../core/user/infra/repositories/user.repository";
config();

export async function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const userRepo = new UserRepository();

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

    const updatedUser = await userRepo.getById(user.userId);

    if (!updatedUser) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    authStorage.set().user(updatedUser);

    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido." });
  }
}
