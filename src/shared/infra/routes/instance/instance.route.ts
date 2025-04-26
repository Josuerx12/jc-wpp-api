import { Router } from "express";
import { CreateInstanceUseCase } from "../../../../core/instances/domain/use-cases/create-instance.use-case";
import { InstanceRepository } from "../../../../core/instances/infra/repositories/instance.repository";
import { SendTextUseCase } from "../../../../core/instances/domain/use-cases/send-text.use-case";

const instanceRouter = Router();

const sessionRepo = new InstanceRepository();

const createConnectionUseCase = new CreateInstanceUseCase(sessionRepo);
const sendTextUseCase = new SendTextUseCase(sessionRepo);

// Criar conexão com wpp.
instanceRouter.post("/create", async (req, res) => {
  try {
    const userId = req.body.userId;
    const instance = req?.body?.sessionId;

    const { qrCode, instanceId } = await createConnectionUseCase.execute({
      userId,
      instanceId: instance,
    });

    res.json({
      message: "Instancia criada com sucesso",
      instanceId,
      qrCode,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao conectar" });
  }
});

// Enviar mensagem
instanceRouter.post("/:sessionId/send-text", async (req, res) => {
  const { number, message } = req.body;

  if (!number || !message) {
    res.status(400).json({ error: "Número e mensagem são obrigatórios" });
  }

  try {
    const result = await sendTextUseCase.execute({
      message,
      to: number,
      sessionId: req.params.sessionId,
    });
    res.json(result);
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default instanceRouter;
