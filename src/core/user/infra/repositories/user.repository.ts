import { Prisma } from "../../../../generated/prisma";
import { prisma } from "../../../../shared/infra/config/prisma";
import {
  IUserRepository,
  UserInputParams,
  UserOutputParams,
} from "../../domain/contracts/user-repository.interface";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserModelMapper } from "../models/user.model.mapper";

export class UserRepository implements IUserRepository {
  async getAll(props: UserInputParams): Promise<UserOutputParams> {
    const where: Prisma.UserWhereInput = {
      name: { contains: props.filter || "", mode: "insensitive" },
      document: { contains: props.filter || "", mode: "insensitive" },
      email: { contains: props.filter || "", mode: "insensitive" },
      phone: { contains: props.filter || "", mode: "insensitive" },
    };

    const totalItems = await prisma.user.count({ where });
    const totalPages = Math.ceil(totalItems / props.perPage);

    const data = await prisma.user.findMany({
      where,
      take: props.perPage,
      skip: (props.page - 1) * props.perPage,
    });

    return {
      data: data.map((d) => UserModelMapper.toEntity(d as any)),
      page: props.page,
      perPage: props.perPage,
      totalItems,
      totalPages,
    };
  }

  async getById(id: string): Promise<UserEntity> {
    const model = await prisma.user.findUnique({ where: { id } });

    return model ? UserModelMapper.toEntity(model as any) : null;
  }

  async getByCode(code: string): Promise<UserEntity> {
    const model = await prisma.user.findUnique({ where: { code } });

    return model ? UserModelMapper.toEntity(model as any) : null;
  }

  async getByDocumentOrEmail(credential: string): Promise<UserEntity> {
    const model = await prisma.user.findFirst({
      where: {
        OR: [
          {
            email: credential,
          },
          {
            document: credential,
          },
        ],
      },
    });

    return model ? UserModelMapper.toEntity(model as any) : null;
  }

  async getByEmail(email: string): Promise<UserEntity> {
    const model = await prisma.user.findUnique({ where: { email } });

    return model ? UserModelMapper.toEntity(model as any) : null;
  }

  async getByDocument(document: string): Promise<UserEntity> {
    const model = await prisma.user.findUnique({ where: { document } });

    return model ? UserModelMapper.toEntity(model as any) : null;
  }

  async create(entity: UserEntity): Promise<void | UserEntity> {
    await prisma.user.create({ data: UserModelMapper.toModel(entity) });
  }

  async update(entity: UserEntity): Promise<void | UserEntity> {
    await prisma.user.update({
      where: { id: entity.id },
      data: UserModelMapper.toModel(entity),
    });
  }

  async delete(id: string): Promise<void | UserEntity> {
    await prisma.user.delete({ where: { id } });
  }
}
