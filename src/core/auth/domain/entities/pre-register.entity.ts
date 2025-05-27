import { v4 } from "uuid";
import { DocumentTypeEnum } from "../../../../generated/prisma";
import { CnpjVo } from "../../../user/domain/vo/cnpj.vo";
import { CpfVo } from "../../../user/domain/vo/cpf.vo";
import { genSaltSync, hashSync } from "bcryptjs";
import { AppError } from "../../../../shared/infra/middlewares/error.middleware";
import { EmailVO } from "../../../user/domain/vo/email.vo";

type PreRegisterEntityProps = {
  id?: string;
  name: string;
  document: string;
  documentType: DocumentTypeEnum;
  phone: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class PreRegisterEntity {
  id: string;
  name: string;
  document: CnpjVo | CpfVo;
  documentType: DocumentTypeEnum;
  phone: string;
  email: EmailVO;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: PreRegisterEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = EmailVO.create(props.email);
    this.documentType = props.documentType;
    this.document =
      props.documentType === DocumentTypeEnum.CNPJ
        ? new CnpjVo(props.document)
        : new CpfVo(props.document);
    this.phone = props.phone;
    this.password = this.setPassword(props.password);
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  private setPassword(password: string): string | undefined {
    if (!password) {
      throw new AppError("Password is required", 400);
    }

    const bcryptRegex = /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/;

    if (bcryptRegex.test(password)) {
      return password;
    }

    const salt = genSaltSync(10);
    return hashSync(password, salt);
  }
}
