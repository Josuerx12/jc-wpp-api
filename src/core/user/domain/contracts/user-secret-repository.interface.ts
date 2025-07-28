import { InputParams } from "../../../../shared/domain/contracts/input-params";
import { OutputParams } from "../../../../shared/domain/contracts/output-params.interface";
import { IRepository } from "../../../../shared/domain/contracts/repository.interface";
import { UserSecretEntity } from "../entities/user-secret.entity";

export type UserSecretFilter = string;

export class UserSecretInputParams extends InputParams<UserSecretFilter> {}

export interface UserSecretOutputParams
  extends OutputParams<UserSecretEntity> {}

export interface IUserSecretRepository
  extends IRepository<
    UserSecretEntity,
    UserSecretInputParams,
    UserSecretOutputParams
  > {
  getByUserId(userId: string): Promise<UserSecretEntity | null>;
  getBySecret(secret: string): Promise<UserSecretEntity | null>;
  generateRandomSecret(): Promise<string>;
}
