import { IRepository } from "../../../../shared/domain/contracts/repository.interface";
import { PreRegisterEntity } from "../entities/pre-register.entity";

export interface IPreRegisterRepository extends IRepository<PreRegisterEntity> {
  getByEmail(email: string): Promise<PreRegisterEntity | null>;
  getByDocument(document: string): Promise<PreRegisterEntity | null>;
}
