import { InputParams } from "../../../../shared/domain/contracts/input-params";
import { OutputParams } from "../../../../shared/domain/contracts/output-params.interface";
import { IRepository } from "../../../../shared/domain/contracts/repository.interface";
import { UserEntity } from "../entities/user.entity";

export type UserFilters = string;

export class UserInputParams extends InputParams<UserFilters> {}

export interface UserOutputParams extends OutputParams<UserEntity> {}

export interface IUserRepository
  extends IRepository<UserEntity, UserInputParams, UserOutputParams> {
  getByEmail(email: string): Promise<UserEntity>;
  getByDocument(document: string): Promise<UserEntity>;
  getByCode(code: string): Promise<UserEntity>;
  getByDocumentOrEmail(credential: string): Promise<UserEntity>;
}
