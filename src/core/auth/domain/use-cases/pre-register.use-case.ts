import { UseCase } from "../../../../shared/domain/contracts/use-case.interface";
import { IPreRegisterRepository } from "../contracts/pre-register.interface";
import { PreRegisterEntity } from "../entities/pre-register.entity";

export class PreRegisterUseCase
  implements UseCase<PreRegisterInput, PreRegisterOutput>
{
  constructor(private readonly repository: IPreRegisterRepository) {}
  async execute(input: PreRegisterInput): Promise<void> {
    const emailAlreadyPreRegistered = await this.repository.getByEmail(
      input.email
    );

    if (emailAlreadyPreRegistered) {
      throw new Error(
        "Email informado já possui um pre cadastro, aguarde que retornaremos o contato, ou nós chame na central de atendimento."
      );
    }

    const documentAlreadyPreRegistered = await this.repository.getByDocument(
      input.document
    );

    if (documentAlreadyPreRegistered) {
      throw new Error(
        "Documento informado já possui um pre cadastro, aguarde que retornaremos o contato, ou nós chame na central de atendimento."
      );
    }

    const preRegister = new PreRegisterEntity(input);

    await this.repository.create(preRegister);
  }
}

export type PreRegisterInput = {
  name: string;
  email: string;
  phone: string;
  document: string;
};

export type PreRegisterOutput = void;
