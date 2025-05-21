import { Request, Router } from "express";
import { UserSecretRepository } from "../../../../core/user/infra/repositories/user-secret.repository";
import { CreateUserUseCase } from "../../../../core/user/domain/use-cases/create-user.use-case";
import { UpdateUserUseCase } from "../../../../core/user/domain/use-cases/update-user.use-case";
import { checkAuth } from "../../middlewares/check-auth.middleware";
import { GetAllUsersUseCase } from "../../../../core/user/domain/use-cases/get-all-users.use-case";
import authStorage from "../auth/auth.storage";
import { UserInstances } from "../../../../core/user/domain/use-cases/user-instances.use-case";
import { InstanceRepository } from "../../../../core/instances/infra/repositories/instance.repository";
import { ChangePasswordUseCase } from "../../../../core/user/domain/use-cases/change-password.use-case";
import { GetUserSecretOrCreateByUserUseCase } from "../../../../core/user/domain/use-cases/get-secret-or-create-by-user.use-case";
import { UserRepository } from "../../../../core/user/infra/repositories/user.repository";
import { RefreshUserSecretUseCase } from "../../../../core/user/domain/use-cases/refresh-user-secret.use-case";

const userRouter: Router = Router();

const userRepo = new UserRepository();
const instanceRepo = new InstanceRepository();
const userSecretRepo = new UserSecretRepository();

const createUserUseCase = new CreateUserUseCase(userRepo);
const updateUserUseCase = new UpdateUserUseCase(userRepo);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepo);
const getUserInstancesUseCase = new UserInstances(instanceRepo);
const changePasswordUseCase = new ChangePasswordUseCase(userRepo);
const getUserSecretOrCreateByUserUseCase =
  new GetUserSecretOrCreateByUserUseCase(userSecretRepo);
const refreshUserSecretUseCase = new RefreshUserSecretUseCase(userSecretRepo);

userRouter.post("/refresh-user-secret", checkAuth, async (req, res) => {
  const result = await refreshUserSecretUseCase.execute();

  res.json({
    message: "Chave secreta atualizada com sucesso!",
    data: result,
  });
});

userRouter.post("/", async (req, res) => {
  const result = await createUserUseCase.execute(req.body);

  res.json({
    message: "Usuário criado com sucesso!",
    data: result,
  });
});

userRouter.put("/:id", checkAuth, async (req, res) => {
  const id = req.params.id;

  const result = await updateUserUseCase.execute({
    id,
    ...req.body,
  });
  res.json({ message: "Usuário editado com sucesso!", result });
});

userRouter.get("/user-secret", checkAuth, async (req, res) => {
  const result = await getUserSecretOrCreateByUserUseCase.execute();

  res.json({ data: result });
});

userRouter.get("/user-logged", checkAuth, async (req: Request, res) => {
  const user = authStorage.get().user();

  delete user.password;
  delete user.code;

  res.json({ data: user });
});

userRouter.get("/:id/instances", checkAuth, async (req, res) => {
  const result = await getUserInstancesUseCase.execute({
    userId: req.params.id,
  });

  res.json(result);
});

userRouter.get("/", checkAuth, async (req, res) => {
  const user = authStorage.get().user();

  const payload = await getAllUsersUseCase.execute({
    ...req.query,
    user,
  });

  res.status(200).json({ payload });
});

userRouter.post("/change-password", checkAuth, async (req, res) => {
  await changePasswordUseCase.execute(req.body);

  res.status(204).end();
});

export default userRouter;
