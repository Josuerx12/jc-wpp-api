import { Prisma } from "../../../../generated/prisma";
import { InstanceEntity } from "../../domain/entities/instance.entity";

export class InstanceModelMapper {
  static toModel(entity: InstanceEntity): Prisma.InstanceCreateInput {
    return {
      authPath: entity.authPath,
      sessionId: entity.sessionId,
      user: {
        connect: {
          id: entity.userId,
        },
      },
    };
  }

  static toEntity(
    model: Partial<Prisma.InstanceGetPayload<{ include: { user: true } }>>
  ): InstanceEntity {
    return new InstanceEntity({
      id: model.id,
      userId: model.userId,
      sessionId: model.sessionId,
      authPath: model.authPath,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
