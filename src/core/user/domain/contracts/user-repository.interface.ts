import { IRepository } from "../../../../shared/domain/contracts/repository.interface";
import { User } from "../entities/user.entity";

export type GetAllUsersInputParams = {
  perPage?: string;
  page?: string;
  filter?: string;
};

export interface IUserRepository
  extends IRepository<User, GetAllUsersInputParams> {
  getByEmail(email: string): Promise<User>;
  getByDocument(document: string): Promise<User>;
}
