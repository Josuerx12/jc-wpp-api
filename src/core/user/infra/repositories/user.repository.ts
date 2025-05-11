import { IUserRepository } from "../../domain/contracts/user-repository.interface";
import { User } from "../../domain/entities/user.entity";
import { IUser, UserModel } from "../models/user.model";

export class UserRepository implements IUserRepository {
  private model = UserModel;

  async getById(id: string): Promise<User> {
    const user = (await this.model.findOne({ userId: id })).toJSON();

    return user ? new User(user as any) : null;
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.model.findOne({ email });

    return user ? new User(user as any) : null;
  }

  async getByDocument(document: string): Promise<User> {
    const user = await this.model.findOne({ document });

    return user ? new User(user as any) : null;
  }

  async getAll(): Promise<User[]> {
    const users = await this.model.find().lean();

    const entities = users.map((u) => {
      delete u.password;

      return new User(u as any);
    });

    return entities;
  }

  async create(entity: User): Promise<void | User> {
    await this.model.create(entity);
  }

  async update(entity: User): Promise<void | User> {
    await this.model.updateOne({ userId: entity.userId }, entity);
  }

  async delete(id: string): Promise<void | User> {
    await this.model.deleteOne({ userId: id });
  }
}
