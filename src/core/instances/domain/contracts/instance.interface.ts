import { InstanceEntity } from "../entities/instance.entity";

export interface IInstanceRepository {
  getById(id: string): Promise<InstanceEntity>;
  getAll(): Promise<InstanceEntity[]>;
  getAllUserInstances(userId: string): Promise<InstanceEntity[]>;
  createOrUpdate(entity: InstanceEntity): Promise<InstanceEntity>;
  delete(id: string): Promise<void>;
}
