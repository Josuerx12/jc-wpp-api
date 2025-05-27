import { Prisma } from "../../../../generated/prisma";
import { PreRegisterEntity } from "../../domain/entities/pre-register.entity";

export class PreRegisterModelMapper {
  static toModel(entity: PreRegisterEntity): Prisma.PreRegisterCreateInput {
    return {
      documentType: entity.documentType,
      document: entity.document.value,
      email: entity.email.value,
      name: entity.name,
      phone: entity.phone,
      password: entity.password,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toEntity(model: Prisma.PreRegisterGetPayload<{}>): PreRegisterEntity {
    return new PreRegisterEntity({
      id: model.id,
      name: model.name,
      document: model.document,
      documentType: model.documentType,
      phone: model.phone,
      email: model.email,
      password: model.password,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
