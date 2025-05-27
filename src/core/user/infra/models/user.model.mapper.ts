import { Prisma } from "../../../../generated/prisma";
import { InstanceModelMapper } from "../../../instances/infra/models/instance.model.mapper";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserSecretModelMapper } from "./user-secret.model.mapper";

export class UserModelMapper {
  static toModel(entity: UserEntity): Prisma.UserCreateInput {
    return {
      ...entity,
      document: entity.document.value,
      email: entity.email.value,
    };
  }

  static toEntity(
    model: Partial<
      Prisma.UserGetPayload<{
        include: { Instance: true; UserSecret: true };
      }>
    >
  ) {
    return new UserEntity({
      id: model.id,
      name: model.name,
      document: model.document,
      documentType: model.documentType,
      email: model.email,
      phone: model.phone,
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
