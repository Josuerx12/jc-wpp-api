import { IInstanceRepository } from "../../domain/contracts/instance.interface";
import { InstanceEntity } from "../../domain/entities/instance.entity";
import { InstanceModel } from "../models/instance.model";

export class InstanceRepository implements IInstanceRepository {
  private instanceModel = InstanceModel;

  async getById(id: string): Promise<InstanceEntity> {
    const model = await this.instanceModel.findOne({
      instanceId: id,
    });

    const instance = new InstanceEntity(model);

    return instance;
  }

  async getAll(): Promise<InstanceEntity[]> {
    const models = await this.instanceModel.find();

    const entities = models.map((m) => new InstanceEntity(m));

    return entities;
  }

  async createOrUpdate(entity: InstanceEntity): Promise<InstanceEntity> {
    const modelInserted = await this.instanceModel.findOneAndUpdate(
      { instanceId: entity.instanceId },
      {
        userId: entity.userId,
        instanceId: entity.instanceId,
        authPath: entity.authPath,
      },
      { upsert: true, new: true }
    );

    const instance = new InstanceEntity(modelInserted);

    return instance;
  }
}
