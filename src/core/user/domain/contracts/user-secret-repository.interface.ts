import { InputParams } from "../../../../shared/domain/contracts/input-params";
import { OutputParams } from "../../../../shared/domain/contracts/output-params.interface";
import { IRepository } from "../../../../shared/domain/contracts/repository.interface";
import { UserSecret } from "../entities/user-secret.entity";

export type UserSecretFilter = string;

export class UserSecretInputParams extends InputParams<UserSecretFilter> {}

export interface UserSecretOutputParams extends OutputParams<UserSecret> {}

export interface IUserSecretRepository
  extends IRepository<
    UserSecret,
    UserSecretInputParams,
    UserSecretOutputParams
  > {
  getByUserId(userId: string): Promise<UserSecret | null>;
  getBySecret(secret: string): Promise<UserSecret | null>;
  generateRandomSecret(): Promise<string>;
}
