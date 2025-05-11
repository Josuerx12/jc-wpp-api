import "../../../types/express";
import { Router } from "express";
import { UserRepository } from "../../../../core/user/infra/repositories/user.repository";
import { CreateUserUseCase } from "../../../../core/user/domain/use-cases/create-user.use-case";
import { UpdateUserUseCase } from "../../../../core/user/domain/use-cases/update-user.use-case";
import { checkAuth } from "../../middlewares/check-auth.middleware";
import { GetUserLoggedUseCase } from "../../../../core/user/domain/use-cases/get-user-logged.use-case";
import { GetAllUsersUseCase } from "../../../../core/user/domain/use-cases/get-all-users.use-case";

const userRouter = Router();

const userRepo = new UserRepository();

const createUserUseCase = new CreateUserUseCase(userRepo);
const updateUserUseCase = new UpdateUserUseCase(userRepo);
const getUserLoggedUseCase = new GetUserLoggedUseCase(userRepo);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepo);

userRouter.post("/", async (req, res) => {
  const result = await createUserUseCase.execute(req.body);

  res.json({
    message: "Usuário criado com sucesso!",
    data: result,
  });
});

userRouter.put("/:userId", async (req, res) => {
  const id = req.params.userId;

  const result = await updateUserUseCase.execute({
    id,
    ...req.body,
  });
  res.json({ message: "Usuário editado com sucesso!", result });
});

userRouter.get("/user-logged", checkAuth, async (req, res) => {
  const result = await getUserLoggedUseCase.execute({ user: req.user as any });

  res.json(result);
});

userRouter.get("/", checkAuth, async (req, res) => {
  const payload = await getAllUsersUseCase.execute({
    ...req.query,
    user: req.user,
  });

  res.status(200).json({ payload });
});

export default userRouter;
