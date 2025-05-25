import { InputParams } from "../../../../shared/domain/contracts/input-params";
import { OutputParams } from "../../../../shared/domain/contracts/output-params.interface";
import { IRepository } from "../../../../shared/domain/contracts/repository.interface";
import { PreRegisterEntity } from "../entities/pre-register.entity";

export type PreRegisterFilter = string;

export class PreRegisterInputParams extends InputParams<PreRegisterFilter> {}

export interface PreRegisterOutputParams
  extends OutputParams<PreRegisterEntity> {}

export interface IPreRegisterRepository
  extends IRepository<
    PreRegisterEntity,
    PreRegisterInputParams,
    PreRegisterOutputParams
  > {
  getByEmail(email: string): Promise<PreRegisterEntity | null>;
  getByDocument(document: string): Promise<PreRegisterEntity | null>;
}
