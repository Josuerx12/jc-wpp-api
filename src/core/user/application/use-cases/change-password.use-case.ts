import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { MailEntity } from "../../../mail/domain/entites/mail.entity";
import { changedPasswordSuccessEmailHTML } from "../../../mail/domain/templates/changed-password.email";
import { mail } from "../../../mail/infra/transporter";
import { IUserRepository } from "../../domain/contracts/user-repository.interface";

export class ChangePasswordUseCase
  implements UseCase<ChangePasswordInput, void>
{
  constructor(private readonly repository: IUserRepository) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const loggedUser = authStorage.get().user();

    await loggedUser.changePassword(input.oldPassword, input.newPassword);

    await this.repository.update(loggedUser);

    const email = new MailEntity({
      to: loggedUser.email,
      subject: "Senha alterada com sucesso",
      html: changedPasswordSuccessEmailHTML(loggedUser.name),
    });

    mail.sendMail(email);
  }
}

export type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
};
