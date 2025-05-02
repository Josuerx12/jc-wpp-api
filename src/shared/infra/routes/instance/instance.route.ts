import { Router } from "express";
import { CreateInstanceUseCase } from "../../../../core/instances/domain/use-cases/create-instance.use-case";
import { InstanceRepository } from "../../../../core/instances/infra/repositories/instance.repository";
import { SendTextUseCase } from "../../../../core/instances/domain/use-cases/send-text.use-case";
import { checkAuth } from "../../middlewares/check-auth.middleware";
import { InstanceListUseCase } from "../../../../core/instances/domain/use-cases/instance-list.use-case";
import { DeleteInstanceUseCase } from "../../../../core/instances/domain/use-cases/delete-instance.use-case";

const instanceRouter = Router();

const sessionRepo = new InstanceRepository();

const createConnectionUseCase = new CreateInstanceUseCase(sessionRepo);
const instanceListUseCase = new InstanceListUseCase(sessionRepo);
const deleteInstanceUseCase = new DeleteInstanceUseCase(sessionRepo);
const sendTextUseCase = new SendTextUseCase(sessionRepo);

// Criar conexão com wpp.
instanceRouter.post("/create", checkAuth, async (req, res) => {
  const userId = req?.user?.userId;
  const instance = req?.body?.instanceId;

  const { qrCode, instanceId, message } = await createConnectionUseCase.execute(
    {
      userId,
      instanceId: instance,
    }
  );

  res.json({
    message,
    instanceId,
    qrCode,
  });
});

// Lista conexões

instanceRouter.get("/", checkAuth, async (req, res) => {
  const response = await instanceListUseCase.execute({ user: req.user });

  res.status(200).json(response);
});

// Lista conexões

instanceRouter.delete("/:id", checkAuth, async (req, res) => {
  await deleteInstanceUseCase.execute({ instanceId: req.params.id });

  res.status(200).end();
});

// Enviar mensagem
instanceRouter.post("/:sessionId/send-text", async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    res.status(400).json({ error: "Número e mensagem são obrigatórios" });
  }

  const result = await sendTextUseCase.execute({
    message,
    to: number,
    sessionId: req.params.sessionId,
  });
  res.json(result);
});

export default instanceRouter;
