import { InstanceEntity } from "../entities/instance.entity";

export interface IInstanceRepository {
  getById(id: string): Promise<InstanceEntity>;
  getAll(): Promise<InstanceEntity[]>;
  createOrUpdate(entity: InstanceEntity): Promise<InstanceEntity>;
}
