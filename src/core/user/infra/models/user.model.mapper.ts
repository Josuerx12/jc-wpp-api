import { Prisma } from "../../../../generated/prisma";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserSecretModelMapper } from "./user-secret.model.mapper";

export class UserModelMapper {
  static toModel(entity: UserEntity): Prisma.UserCreateInput {
    return {
      ...entity,
    };
  }

  static toEntity(
    model: Prisma.UserGetPayload<{
      include: { Instance: true; UserSecret: true };
    }>
  ) {
    return new UserEntity({
      id: model.id,
      name: model.name,
      document: model.document,
      documentType: model.documentType,
      email: model.email,
      code: model.code,
      password: model.password,
      role: model.role,
      secret:
        model.UserSecret && UserSecretModelMapper.toEntity(model.UserSecret[0]),
      instances:
        model.Instance &&
        model.Instance.map((i) => InstanceModelMapper.toEntity(i)),
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
