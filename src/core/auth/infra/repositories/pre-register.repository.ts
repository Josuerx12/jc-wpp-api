import { IPreRegisterRepository } from "../../domain/contracts/pre-register.interface";
import { PreRegisterEntity } from "../../domain/entities/pre-register.entity";
import { PreRegisterModel } from "../models/pre-register.model";

export class PreRegisterRepository implements IPreRegisterRepository {
  private model = PreRegisterModel;

  async getById(id: string): Promise<PreRegisterEntity> {
    const preRegister = (
      await this.model.findOne({ preRegisterId: id })
    ).toJSON();

    return preRegister ? new PreRegisterEntity(preRegister as any) : null;
  }

  async getByEmail(email: string): Promise<PreRegisterEntity> {
    const preRegister = await this.model.findOne({ email });

    return preRegister ? new PreRegisterEntity(preRegister as any) : null;
  }

  async getByDocument(document: string): Promise<PreRegisterEntity> {
    const preRegister = await this.model.findOne({ document });

    return preRegister ? new PreRegisterEntity(preRegister as any) : null;
  }

  async getAll(): Promise<PreRegisterEntity[]> {
    const preRegisters = await this.model.find().lean();

    const entities = preRegisters.map((u) => new PreRegisterEntity(u as any));

    return entities;
  }

  async create(entity: PreRegisterEntity): Promise<void | PreRegisterEntity> {
    await this.model.create(entity);
  }

  async update(entity: PreRegisterEntity): Promise<void | PreRegisterEntity> {
    await this.model.updateOne({ preRegisterId: entity.preRegisterId }, entity);
  }

  async delete(id: string): Promise<void | PreRegisterEntity> {
    await this.model.deleteOne({ preRegisterId: id });
  }
}
