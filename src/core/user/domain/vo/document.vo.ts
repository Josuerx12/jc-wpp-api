import { AppError } from "../../../../shared/infra/middlewares/error.middleware";

export class DocumentVO {
  private constructor(public readonly value: string) {}

  static create(document: string): DocumentVO {
    DocumentVO.validate(document);
    return new DocumentVO(document);
  }

  static validate(document: string): void {
    if (document.length < 11) {
      throw new AppError("O documento deve ter pelo menos 11 caracteres.");
    }
    if (document.length > 14) {
      throw new AppError("O documento deve ter no máximo 14 caracteres.");
    }
    if (!/^\d+$/.test(document)) {
      throw new AppError("O documento deve conter apenas números.");
    }
  }
}
