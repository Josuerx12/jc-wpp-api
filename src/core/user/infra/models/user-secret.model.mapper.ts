import { Prisma } from "../../../../generated/prisma";
import { UserSecretEntity } from "../../domain/entities/user-secret.entity";

export class UserSecretModelMapper {
  static toModel(entity: UserSecretEntity): Prisma.UserSecretCreateInput {
    return {
      secret: entity.secret,
      user: {
        connect: {
          id: entity.userId,
        },
      },
    };
  }

  static toEntity(model: Prisma.UserSecretGetPayload<{}>) {
    return new UserSecretEntity({
      id: model.id,
      userId: model.userId,
      secret: model.secret,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
