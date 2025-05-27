import { prisma } from "../../../../shared/infra/config/prisma";
import {
  IPreRegisterRepository,
  PreRegisterInputParams,
  PreRegisterOutputParams,
} from "../../domain/contracts/pre-register.interface";
import { PreRegisterEntity } from "../../domain/entities/pre-register.entity";
import { PreRegisterModelMapper } from "../models/pre-register.model.mapper";

export class PreRegisterRepository implements IPreRegisterRepository {
  async getById(id: string): Promise<PreRegisterEntity> {
    const preRegister = await prisma.preRegister.findUnique({ where: { id } });

    return preRegister ? PreRegisterModelMapper.toEntity(preRegister) : null;
  }

  async getByEmail(email: string): Promise<PreRegisterEntity> {
    const preRegister = await prisma.preRegister.findUnique({
      where: { email },
    });

    return preRegister ? PreRegisterModelMapper.toEntity(preRegister) : null;
  }

  async getByDocument(document: string): Promise<PreRegisterEntity> {
    const preRegister = await prisma.preRegister.findUnique({
      where: { document },
    });

    return preRegister ? PreRegisterModelMapper.toEntity(preRegister) : null;
  }

  getAll(props: PreRegisterInputParams): Promise<PreRegisterOutputParams> {
    throw new Error("Method not implemented.");
  }

  async create(entity: PreRegisterEntity): Promise<void | PreRegisterEntity> {
    await prisma.preRegister.create({
      data: PreRegisterModelMapper.toModel(entity),
    });
  }

  async update(entity: PreRegisterEntity): Promise<void | PreRegisterEntity> {
    await prisma.preRegister.update({
      where: { id: entity.id },
      data: PreRegisterModelMapper.toModel(entity),
    });
  }

  async delete(id: string): Promise<void | PreRegisterEntity> {
    await prisma.preRegister.delete({ where: { id } });
  }
}
