import { Request, Response } from "express";
import { DeleteInstanceUseCase } from "../../../instances/application/use-cases/delete-instance.use-case";
import { InstanceRepository } from "../../../instances/infra/repositories/instance.repository";
import { UserSecretRepository } from "../../infra/repositories/user-secret.repository";
import { UserRepository } from "../../infra/repositories/user.repository";
import { ChangePasswordUseCase } from "../use-cases/change-password.use-case";
import { CreateUserUseCase } from "../use-cases/create-user.use-case";
import { DeleteUserUseCase } from "../use-cases/delete-user.use-case";
import { GetAllUsersUseCase } from "../use-cases/get-all-users.use-case";
import { GetUserSecretOrCreateByUserUseCase } from "../use-cases/get-secret-or-create-by-user.use-case";
import { RefreshUserSecretUseCase } from "../use-cases/refresh-user-secret.use-case";
import { UpdateUserUseCase } from "../use-cases/update-user.use-case";
import { UserInstances } from "../use-cases/user-instances.use-case";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";

export class UserController {
  private userRepo = new UserRepository();
  private instanceRepo = new InstanceRepository();
  private userSecretRepo = new UserSecretRepository();

  private createUserUseCase = new CreateUserUseCase(this.userRepo);
  private updateUserUseCase = new UpdateUserUseCase(this.userRepo);
  private getAllUsersUseCase = new GetAllUsersUseCase(this.userRepo);
  private getUserInstancesUseCase = new UserInstances(this.instanceRepo);
  private changePasswordUseCase = new ChangePasswordUseCase(this.userRepo);
  private getUserSecretOrCreateByUserUseCase =
    new GetUserSecretOrCreateByUserUseCase(this.userSecretRepo);
  private refreshUserSecretUseCase = new RefreshUserSecretUseCase(
    this.userSecretRepo
  );
  private deleteInstanceUseCase = new DeleteInstanceUseCase(this.instanceRepo);
  private deleteUserUseCase = new DeleteUserUseCase(
    this.userRepo,
    this.instanceRepo,
    this.deleteInstanceUseCase
  );

  refreshUserSecret = async (req: Request, res: Response) => {
    const result = await this.refreshUserSecretUseCase.execute();

    res.json({
      message: "Chave secreta atualizada com sucesso!",
      data: result,
    });
  };

  getUserSecret = async (req: Request, res: Response) => {
    const result = await this.getUserSecretOrCreateByUserUseCase.execute();

    res.json({ data: result });
  };

  create = async (req: Request, res: Response) => {
    const result = await this.createUserUseCase.execute(req.body);

    res.json({
      message: "Usuário criado com sucesso!",
      data: result,
    });
  };

  update = async (req: Request, res: Response) => {
    const id = req.params.id;

    const result = await this.updateUserUseCase.execute({
      id,
      ...req.body,
    });
    res.json({ message: "Usuário editado com sucesso!", result });
  };

  changePassword = async (req: Request, res: Response) => {
    await this.changePasswordUseCase.execute(req.body);

    res.status(204).end();
  };

  deleteById = async (req: Request, res: Response) => {
    const id = req.params.id;

    await this.deleteUserUseCase.execute({
      id,
    });

    res.status(204).end();
  };

  getMe = async (req: Request, res: Response) => {
    const user = authStorage.get().user();

    delete user.password;
    delete user.code;

    res.json({ data: user });
  };

  getUserInstances = async (req: Request, res: Response) => {
    const result = await this.getUserInstancesUseCase.execute({
      userId: req.params.id,
    });

    res.json(result);
  };

  getAll = async (req: Request, res: Response) => {
    const user = authStorage.get().user();

    const payload = await this.getAllUsersUseCase.execute({
      ...req.query,
      user,
    });

    res.status(200).json({ payload });
  };
}
