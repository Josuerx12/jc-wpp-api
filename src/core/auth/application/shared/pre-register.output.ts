import e from "express";
import { DocumentTypeEnum } from "../../../../generated/prisma";
import { PreRegisterEntity } from "../../domain/entities/pre-register.entity";

export type PreRegisterOutput = {
  id: string;
  name: string;
  email: string;
  document: string;
  documentType: DocumentTypeEnum;
  phone: string;
  createdAt: Date;
  updatedAt?: Date;
};

export class PreRegisterOutputMapper {
  static toOutput(preRegister: PreRegisterEntity): PreRegisterOutput {
    return {
      id: preRegister.id,
      name: preRegister.name,
      email: preRegister.email.value,
      document: preRegister.document.value,
      documentType: preRegister.documentType,
      phone: preRegister.phone,
      createdAt: preRegister.createdAt,
      updatedAt: preRegister.updatedAt,
    };
  }
}
