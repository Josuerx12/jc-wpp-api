import { IRepository } from "../../../../shared/domain/contracts/repository.interface";
import { User } from "../entities/user.entity";

export interface IUserRepository extends IRepository<User> {
  getByEmail(email: string): Promise<User>;
  getByDocument(document: string): Promise<User>;
}
