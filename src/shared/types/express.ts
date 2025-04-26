import "express";
import { User } from "../../core/user/domain/entities/user.entity";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}
