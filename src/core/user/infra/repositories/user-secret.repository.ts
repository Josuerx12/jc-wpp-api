import {
  GetAllUserSecretsInputParams,
  IUserSecretRepository,
} from "../../domain/contracts/user-secret-repository.interface";
import { UserSecret } from "../../domain/entities/user-secret.entity";
import { UserSecretModel } from "../models/user-secret.model";

export class UserSecretRepository implements IUserSecretRepository {
  private model = UserSecretModel;

  async getBySecret(secret: string): Promise<UserSecret | null> {
    const userSecret = await this.model.findOne({ secret });
    return userSecret ? new UserSecret(userSecret) : null;
  }

  async getByUserId(userId: string): Promise<UserSecret | null> {
    const userSecret = await this.model.findOne({ userId });

    return userSecret ? new UserSecret(userSecret) : null;
  }

  async generateRandomSecret(): Promise<string> {
    let isUnique = false;
    let randomSecret: string;

    while (!isUnique) {
      randomSecret = UserSecret.generateRandomSecret();
      const alreadyExists = await this.model.findOne({ secret: randomSecret });
      if (!alreadyExists) {
        isUnique = true;
      }
    }

    return randomSecret;
  }

  getAll(props: GetAllUserSecretsInputParams): Promise<UserSecret[]> {
    throw new Error("Method not implemented.");
  }

  async getById(id: string): Promise<UserSecret> {
    const userSecret = await this.model.findOne({ userSecretId: id });

    return userSecret ? new UserSecret(userSecret as any) : null;
  }

  async create(entity: UserSecret): Promise<void | UserSecret> {
    await this.model.create(entity);
  }

  async update(entity: UserSecret): Promise<void | UserSecret> {
    await this.model.updateOne({ userSecretId: entity.userSecretId }, entity);
  }

  async delete(id: string): Promise<void | UserSecret> {
    await this.model.deleteOne({ userSecretId: id });
  }
}
