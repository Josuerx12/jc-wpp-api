import { Router } from "express";
import { UserRepository } from "../../../../core/user/infra/repositories/user.repository";
import { CreateUserUseCase } from "../../../../core/user/domain/use-cases/create-user.use-case";
import { UpdateUserUseCase } from "../../../../core/user/domain/use-cases/update-user.use-case";
import { checkAuth } from "../../middlewares/check-auth.middleware";
import { GetUserLoggedUseCase } from "../../../../core/user/domain/use-cases/get-user-logged.use-case";

const userRouter = Router();

const userRepo = new UserRepository();

const createUserUseCase = new CreateUserUseCase(userRepo);
const updateUserUseCase = new UpdateUserUseCase(userRepo);
const getUserLoggedUseCase = new GetUserLoggedUseCase(userRepo);

userRouter.post("/", async (req, res) => {
  try {
    const result = await createUserUseCase.execute(req.body);

    res.json({
      message: "Usuário criado com sucesso!",
      data: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

userRouter.put("/:userId", async (req, res) => {
  const id = req.params.userId;

  try {
    const result = await updateUserUseCase.execute({
      id,
      ...req.body,
    });
    res.json({ message: "Usuário editado com sucesso!", result });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

userRouter.get("/user-logged", checkAuth, async (req, res) => {
  try {
    const result = await getUserLoggedUseCase.execute(req.user as any);

    res.json(result);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default userRouter;
