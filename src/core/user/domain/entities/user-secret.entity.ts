export type UserSecretEntityProps = {
  id?: string;
  userId: string;
  secret: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserSecretEntity {
  id?: string;
  userId: string;
  secret: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(props: UserSecretEntityProps) {
    this.id = props.id;
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
