import { Router } from "express";
import { UserRepository } from "../../../../core/user/infra/repositories/user.repository";
import { CreateUserUseCase } from "../../../../core/user/domain/use-cases/create-user.use-case";
import { UpdateUserUseCase } from "../../../../core/user/domain/use-cases/update-user.use-case";

const userRouter = Router();

const userRepo = new UserRepository();

const createUserUseCase = new CreateUserUseCase(userRepo);
const updateUserUseCase = new UpdateUserUseCase(userRepo);

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

// Enviar mensagem
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

export default userRouter;
