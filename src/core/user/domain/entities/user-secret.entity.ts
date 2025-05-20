import { IUserSecret } from "../../infra/models/user-secret.model";

export class UserSecret {
  userSecretId: string;
  userId: string;
  secret: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    props: Partial<IUserSecret> & { createdAt?: Date; updatedAt?: Date }
  ) {
    this.userSecretId = props.userSecretId || crypto.randomUUID();
    this.userId = props.userId;
    this.secret = props.secret;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  static generateRandomSecret(): string {
    return Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
}
