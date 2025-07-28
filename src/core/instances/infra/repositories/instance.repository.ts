import { prisma } from "../../../../shared/infra/config/prisma";
import {
  IInstanceRepository,
  InstanceInputParams,
  InstanceOutputParams,
} from "../../domain/contracts/instance.interface";
import { InstanceEntity } from "../../domain/entities/instance.entity";
import { InstanceModelMapper } from "../models/instance.model.mapper";

export class InstanceRepository implements IInstanceRepository {
  async getBySessionId(sessionId: string): Promise<InstanceEntity | null> {
    const model = await prisma.instance.findUnique({
      where: { sessionId },
    });

    const instance = model ? InstanceModelMapper.toEntity(model) : null;

    return instance;
  }
  async getById(id: string): Promise<InstanceEntity> {
    const model = await prisma.instance.findUnique({
      where: { id },
    });

    const instance = model ? InstanceModelMapper.toEntity(model) : null;

    return instance;
  }

  async getAllUserInstances(userId: string): Promise<InstanceEntity[]> {
    const models = await prisma.instance.findMany({
      where: { userId },
    });

    const entities = models?.map((m) => new InstanceEntity(m));

    return entities;
  }

  async createOrUpdate(entity: InstanceEntity): Promise<InstanceEntity> {
    const modelInserted = await prisma.instance.upsert({
      where: { id: entity.id },
      update: InstanceModelMapper.toModel(entity),
      create: InstanceModelMapper.toModel(entity),
    });

    const instance = InstanceModelMapper.toEntity(modelInserted);

    return instance;
  }

  async delete(id: string): Promise<void> {
    await prisma.instance.delete({ where: { sessionId: id } });
    return;
  }

  getAll(props: InstanceInputParams): Promise<InstanceOutputParams> {
    throw new Error("Method not implemented.");
  }
  create(entity: InstanceEntity): Promise<void | InstanceEntity> {
    throw new Error("Method not implemented.");
  }
  update(entity: InstanceEntity): Promise<void | InstanceEntity> {
    throw new Error("Method not implemented.");
  }
}
