import { InputParams } from "../../../../shared/domain/contracts/input-params";
import { OutputParams } from "../../../../shared/domain/contracts/output-params.interface";
import { IRepository } from "../../../../shared/domain/contracts/repository.interface";
import { InstanceEntity } from "../entities/instance.entity";

export type InstanceFilter = string;

export class InstanceInputParams extends InputParams<InstanceFilter> {}

export interface InstanceOutputParams extends OutputParams<InstanceEntity> {}

export interface IInstanceRepository
  extends IRepository<
    InstanceEntity,
    InstanceInputParams,
    InstanceOutputParams
  > {
  getAllUserInstances(userId: string): Promise<InstanceEntity[]>;
  createOrUpdate(entity: InstanceEntity): Promise<InstanceEntity>;
  getBySessionId(sessionId: string): Promise<InstanceEntity | null>;
}
