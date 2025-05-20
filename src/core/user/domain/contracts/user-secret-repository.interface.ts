import { IRepository } from "../../../../shared/domain/contracts/repository.interface";
import { UserSecret } from "../entities/user-secret.entity";

export type GetAllUserSecretsInputParams = {
  perPage?: string;
  page?: string;
  filter?: string;
};

export interface IUserSecretRepository
  extends IRepository<UserSecret, GetAllUserSecretsInputParams> {
  getByUserId(userId: string): Promise<UserSecret | null>;
  getBySecret(secret: string): Promise<UserSecret | null>;
  generateRandomSecret(): Promise<string>;
}
