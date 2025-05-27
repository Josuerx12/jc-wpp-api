import { DocumentTypeEnum } from "../../../../generated/prisma";
import { UserEntity } from "../../domain/entities/user.entity";

export type UserOutput = {
  id: string;
  name: string;
  email: string;
  document: string;
  documentType: DocumentTypeEnum;
  phone: string;
  createdAt: Date;
  updatedAt?: Date;
};

export class UserOutputMapper {
  static toOutput(user: UserEntity): UserOutput {
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      document: user.document.value,
      documentType: user.documentType,
      phone: user.phone,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
