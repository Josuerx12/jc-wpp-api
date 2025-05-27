import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { IUserSecretRepository } from "../../domain/contracts/user-secret-repository.interface";
import { UserSecretEntity } from "../../domain/entities/user-secret.entity";

export class GetUserSecretOrCreateByUserUseCase
  implements UseCase<null, UserSecretEntity>
{
  constructor(private readonly repository: IUserSecretRepository) {}
  async execute(): Promise<UserSecretEntity> {
    const user = authStorage.get().user();

    let secret = await this.repository.getByUserId(user.id);

    if (!secret) {
      const randomSecret = await this.repository.generateRandomSecret();

      secret = new UserSecretEntity({
        userId: user.id,
        secret: randomSecret,
      });

      await this.repository.create(secret);
    }

    return secret;
  }
}
