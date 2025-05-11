import { IRepository } from "../../../../shared/domain/contracts/repository.interface";
import { PreRegisterEntity } from "../entities/pre-register.entity";

export type GetAllPreRegisterInputParams = {
  page?: string;
  perPage?: string;
  filter?: string;
};

export interface IPreRegisterRepository
  extends IRepository<PreRegisterEntity, GetAllPreRegisterInputParams> {
  getByEmail(email: string): Promise<PreRegisterEntity | null>;
  getByDocument(document: string): Promise<PreRegisterEntity | null>;
}
