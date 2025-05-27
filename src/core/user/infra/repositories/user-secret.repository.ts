import { Prisma } from "../../../../generated/prisma";
import { prisma } from "../../../../shared/infra/config/prisma";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import {
  IUserSecretRepository,
  UserSecretInputParams,
  UserSecretOutputParams,
} from "../../domain/contracts/user-secret-repository.interface";
import { UserSecretEntity } from "../../domain/entities/user-secret.entity";
import { UserSecretModelMapper } from "../models/user-secret.model.mapper";

export class UserSecretRepository implements IUserSecretRepository {
  getAll(props: UserSecretInputParams): Promise<UserSecretOutputParams> {
    return;
  }
  async getBySecret(secret: string): Promise<UserSecretEntity | null> {
    const userSecret = await prisma.userSecret.findFirst({
      where: { secret },
    });
    return userSecret ? UserSecretModelMapper.toEntity(userSecret) : null;
  }

  async getByUserId(userId: string): Promise<UserSecretEntity | null> {
    const userSecret = await prisma.userSecret.findFirst({ where: { userId } });

    return userSecret ? UserSecretModelMapper.toEntity(userSecret) : null;
  }

  async generateRandomSecret(): Promise<string> {
    let isUnique = false;
    let randomSecret: string;

    while (!isUnique) {
      randomSecret = UserSecretEntity.generateRandomSecret();
      const alreadyExists = await prisma.userSecret.findFirst({
        where: { secret: randomSecret },
        select: { secret: true },
      });
      if (!alreadyExists) {
        isUnique = true;
      }
    }

    return randomSecret;
  }

  async getById(id: string): Promise<UserSecretEntity> {
    const userSecret = await prisma.userSecret.findFirst({ where: { id } });

    return userSecret ? UserSecretModelMapper.toEntity(userSecret) : null;
  }

  async create(entity: UserSecretEntity): Promise<void | UserSecretEntity> {
    await prisma.userSecret.create({
      data: UserSecretModelMapper.toModel(entity),
    });
  }

  async update(entity: UserSecretEntity): Promise<void | UserSecretEntity> {
    await prisma.userSecret.update({
      where: { id: entity.id },
      data: UserSecretModelMapper.toModel(entity),
    });
  }

  async delete(id: string): Promise<void | UserSecretEntity> {
    await prisma.userSecret.delete({ where: { id } });
  }
}
