import { AppError } from "../../../../shared/infra/middlewares/error.middleware";

export function validateDocument(document: string): boolean {
  document = document.replace(/[^\d]+/g, "");

  if (document.length !== 11 || /^(\d)\1{10}$/.test(document)) {
    return false;
  }
  const digits = document.split("").map(Number);
  const validateDigit = (baseLength: number): number => {
    const factor = baseLength + 1;
    const sum = digits
      .slice(0, baseLength)
      .reduce((acc, digit, index) => acc + digit * (factor - index), 0);

    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  const firstDigitValid = validateDigit(9) === digits[9];
  const secondDigitValid = validateDigit(10) === digits[10];

  return firstDigitValid && secondDigitValid;
}

export class CpfVo {
  constructor(private _value?: string) {
    this._value = _value;
    this.validate();
  }

  public validate(): void {
    if (!validateDocument(this.value)) {
      throw new AppError("CPF deve ser valido.", 400);
    }
  }

  public get value(): string {
    return this._value;
  }

  public getFormatted(): string {
    return this._value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
}
