import { Prisma } from "../../../../generated/prisma";
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

  async getAll(
    props: PreRegisterInputParams
  ): Promise<PreRegisterOutputParams> {
    const where: Prisma.PreRegisterWhereInput = {
      OR: [
        { email: { contains: props.filter || "", mode: "insensitive" } },
        { document: { contains: props.filter || "", mode: "insensitive" } },
        { name: { contains: props.filter || "", mode: "insensitive" } },
        { phone: { contains: props.filter || "", mode: "insensitive" } },
      ],
    };

    const totalItems = await prisma.preRegister.count({ where });
    const totalPages = Math.ceil(props.perPage / props.perPage);

    const entities = await prisma.preRegister.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: props.perPage,
      skip: (props.page - 1) * props.perPage,
    });

    return {
      data: entities.map(PreRegisterModelMapper.toEntity),
      page: props.page,
      perPage: props.perPage,
      totalItems,
      totalPages,
    };
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
