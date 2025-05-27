import { compare, compareSync, genSaltSync, hashSync } from "bcryptjs";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import { DocumentTypeEnum, RoleEnum } from "../../../../generated/prisma";
import { InstanceEntity } from "../../../instances/domain/entities/instance.entity";
import { UserSecretEntity } from "./user-secret.entity";
import { CnpjVo } from "../vo/cnpj.vo";
import { CpfVo } from "../vo/cpf.vo";

export type UserEntityProps = {
  id?: string;
  name: string;
  email: string;
  document: string;
  documentType: DocumentTypeEnum;
  phone: string;
  password: string;
  code?: string;
  role?: RoleEnum;
  instances?: InstanceEntity[];
  secret?: UserSecretEntity;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserEntity {
  id: string;
  name: string;
  documentType: DocumentTypeEnum;
  document: CnpjVo | CpfVo;
  email: string;
  password: string;
  phone: string;
  role: RoleEnum;
  code: string;
  instances?: InstanceEntity[];
  secret?: UserSecretEntity;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: UserEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.documentType = props.documentType;
    this.document =
      props.documentType === DocumentTypeEnum.CNPJ
        ? new CnpjVo(props.document)
        : new CpfVo(props.document);
    this.email = props.email;
    this.password = this.setPassword(props.password);
    this.role = props.role ? props.role : RoleEnum.USER;
    this.code = props.code;
    this.phone = props.phone;
    this.instances = props.instances;
    this.secret = props.secret;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  private setPassword(password: string): string | undefined {
    if (!password) return undefined;

    const bcryptRegex = /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/;

    if (bcryptRegex.test(password)) {
      return password;
    }

    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    if (!this.password) {
      throw new AppError("Senha não está definida.");
    }

    const isMatch = await compare(oldPassword, this.password);

    if (!isMatch) {
      throw new AppError("Senha atual incorreta.");
    }

    this.password = this.setPassword(newPassword);
  }

  resetPasswordWithCode(code: string, newPassword: string) {
    if (!this.code || this.code !== code) {
      throw new AppError("Código inválido ou expirado.");
    }

    this.password = this.setPassword(newPassword);
    this.code = undefined;
  }

  generateCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.code = code;
  }

  isSuper() {
    return this.role === RoleEnum.SUPER;
  }

  isAdmin() {
    return this.role === RoleEnum.ADMIN;
  }

  isUser() {
    return this.role === RoleEnum.USER;
  }

  verifyPassword(password: string) {
    const compare = compareSync(password, this.password!);

    if (!compare) {
      throw new AppError("Credenciais invalidas!", 400);
    }
  }
}
