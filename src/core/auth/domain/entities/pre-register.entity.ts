import { v4 } from "uuid";
import { IPreRegister } from "../../infra/models/pre-register.model";

export class PreRegisterEntity {
  preRegisterId: string;
  name: string;
  document: string;
  phone: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(
    props: Partial<IPreRegister> & { createdAt?: Date; updatedAt?: Date }
  ) {
    this.preRegisterId = props.preRegisterId || v4();
    this.name = props.name;
    this.email = props.email;
    this.document = props.document;
    this.phone = props.phone;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }
}
