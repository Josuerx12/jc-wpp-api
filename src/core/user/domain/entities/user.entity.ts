import { compare, compareSync, genSaltSync, hashSync } from "bcryptjs";
import { IUser, UserRoles } from "../../infra/models/user.model";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";

export class User {
  userId: string;
  name: string;
  document: string;
  email: string;
  password: string;
  isTempPass: boolean;
  role: UserRoles;
  code: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: Partial<IUser> & { createdAt?: Date; updatedAt?: Date }) {
    this.userId = props.userId;
    this.name = props.name;
    this.document = props.document;
    this.email = props.email;
    this.password = this.setPassword(props.password);
    this.isTempPass = props.isTempPass;
    this.role = props.role ? props.role : UserRoles.USER;
    this.code = props.code;
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
    return this.role === UserRoles.SUPER;
  }

  isAdmin() {
    return this.role === UserRoles.ADMIN;
  }

  isUser() {
    return this.role === UserRoles.USER;
  }

  isTempPassword() {
    return this.isTempPass;
  }

  verifyPassword(password: string) {
    const compare = compareSync(password, this.password!);

    if (!compare) {
      throw new AppError("Credenciais invalidas!", 400);
    }
  }
}
