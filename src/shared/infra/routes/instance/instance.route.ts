import { Request, Router } from "express";
import { CreateInstanceUseCase } from "../../../../core/instances/domain/use-cases/create-instance.use-case";
import { InstanceRepository } from "../../../../core/instances/infra/repositories/instance.repository";
import { SendTextUseCase } from "../../../../core/instances/domain/use-cases/send-text.use-case";
import { checkAuth } from "../../middlewares/check-auth.middleware";
import { InstanceListUseCase } from "../../../../core/instances/domain/use-cases/instance-list.use-case";
import { DeleteInstanceUseCase } from "../../../../core/instances/domain/use-cases/delete-instance.use-case";
import authStorage from "../auth/auth.storage";
import { checkSecret } from "../../middlewares/check-secret.middleware";
import { CreateGroupUseCase } from "../../../../core/instances/domain/use-cases/create-group.use-case";
import { SendGroupTextUseCase } from "../../../../core/instances/domain/use-cases/send-group-text.use-case";

const instanceRouter: Router = Router();

const sessionRepo = new InstanceRepository();

const createConnectionUseCase = new CreateInstanceUseCase(sessionRepo);
const instanceListUseCase = new InstanceListUseCase(sessionRepo);
const deleteInstanceUseCase = new DeleteInstanceUseCase(sessionRepo);
const sendTextUseCase = new SendTextUseCase(sessionRepo);
const sendGroupTextUseCase = new SendGroupTextUseCase(sessionRepo);
const createGroupUseCase = new CreateGroupUseCase(sessionRepo);

// Criar conexão com wpp.
instanceRouter.post("/create", checkAuth, async (req: Request, res) => {
  const instance = req?.body?.instanceId;

  const user = authStorage.get().user();

  const { qrCode, instanceId, message, bussinessProfile, avatarUrl, profile } =
    await createConnectionUseCase.execute({
      instanceId: instance,
      userId: user.userId,
    });

  res.json({
    message,
    instanceId,
    qrCode,
    profile,
    bussinessProfile,
    avatarUrl,
  });
});

// Lista conexões

instanceRouter.get("/", checkAuth, async (req, res) => {
  const user = authStorage.get().user();

  const response = await instanceListUseCase.execute({ user });

  res.status(200).json(response);
});

// Lista conexões

instanceRouter.delete("/:id", checkAuth, async (req, res) => {
  await deleteInstanceUseCase.execute({ instanceId: req.params.id });

  res.status(200).end();
});

// Enviar mensagem
instanceRouter.post("/:sessionId/send-text", checkSecret, async (req, res) => {
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

//Criar grupo
instanceRouter.post(
  "/:sessionId/create-group",
  checkSecret,
  async (req, res) => {
    const { subject, numbers } = req.body;

    if (!subject || !numbers) {
      res.status(400).json({ error: "Números e assunto são obrigatórios" });
    }

    const result = await createGroupUseCase.execute({
      numbers,
      subject,
      sessionId: req.params.sessionId,
    });
    res.json(result);
  }
);

// Enviar mensagem em grupo
instanceRouter.post(
  "/:sessionId/send-group-text",
  checkSecret,
  async (req, res) => {
    const { groupId, message } = req.body;

    if (!groupId || !message) {
      res
        .status(400)
        .json({ error: "Id do grupo e mensagem são obrigatórios" });
    }

    const result = await sendGroupTextUseCase.execute({
      message,
      groupId,
      sessionId: req.params.sessionId,
    });
    res.json(result);
  }
);

export default instanceRouter;
