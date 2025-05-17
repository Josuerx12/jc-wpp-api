import { AppError } from "../../../../shared/infra/middlewares/error.middleware";

export class EmailVO {
  private constructor(public readonly value: string) {}

  static create(email: string): EmailVO {
    EmailVO.validate(email);
    return new EmailVO(email);
  }

  static validate(email: string): void {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new AppError("O email deve ser válido.");
    }
    if (email.length < 5) {
      throw new AppError("O email deve ter pelo menos 5 caracteres.");
    }
  }
}
