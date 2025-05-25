import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { IUserSecretRepository } from "../../domain/contracts/user-secret-repository.interface";
import { UserSecret } from "../../domain/entities/user-secret.entity";

export class RefreshUserSecretUseCase implements UseCase<null, UserSecret> {
  constructor(private userSecretRepository: IUserSecretRepository) {}

  async execute(): Promise<UserSecret> {
    const user = authStorage.get().user();
    const userId = user.userId;

    const userSecret = await this.userSecretRepository.getByUserId(userId);

    if (!userSecret) {
      throw new Error("User secret not found");
    }

    const newSecret = await this.userSecretRepository.generateRandomSecret();

    userSecret.secret = newSecret;

    await this.userSecretRepository.update(userSecret);

    return userSecret;
  }
}
