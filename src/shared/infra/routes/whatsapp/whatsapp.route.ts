import { Router } from "express";
import { SessionRepository } from "../../../../core/whatsapp/infra/repositories/session.repository";
import { CreateConnectWithWppUseCase } from "../../../../core/whatsapp/domain/use-cases/connect-with-wpp.use-case";
import { SendTextUseCase } from "../../../../core/whatsapp/domain/use-cases/send-text.use-case";

const wppRouter = Router();

const sessionRepo = new SessionRepository();

const createConnectionUseCase = new CreateConnectWithWppUseCase(sessionRepo);
const sendTextUseCase = new SendTextUseCase(sessionRepo);

// Criar conexão com wpp.
wppRouter.post("/connect", async (req, res) => {
  try {
    const userId = req.body.userId;
    const session = req?.body?.sessionId;

    const { qrCode, sessionId } = await createConnectionUseCase.execute({
      userId,
      sessionId: session,
    });

    res.json({
      message: "Sessão iniciada com sucesso",
      sessionId,
      qrCode,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Erro ao conectar" });
  }
});

// Enviar mensagem
wppRouter.post("/:sessionId/send-text", async (req, res) => {
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

export default wppRouter;
