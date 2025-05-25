import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { IUserSecretRepository } from "../../domain/contracts/user-secret-repository.interface";
import { UserSecret } from "../../domain/entities/user-secret.entity";

export class GetUserSecretOrCreateByUserUseCase
  implements UseCase<null, UserSecret>
{
  constructor(private readonly repository: IUserSecretRepository) {}
  async execute(): Promise<UserSecret> {
    const user = authStorage.get().user();

    let secret = await this.repository.getByUserId(user.userId);

    if (!secret) {
      const randomSecret = await this.repository.generateRandomSecret();

      secret = new UserSecret({
        userId: user.userId,
        secret: randomSecret,
      });

      await this.repository.create(secret);
    }

    return secret;
  }
}
