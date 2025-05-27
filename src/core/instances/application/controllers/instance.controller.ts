import { Request, Response } from "express";
import { InstanceRepository } from "../../infra/repositories/instance.repository";
import { CreateGroupUseCase } from "../use-cases/create-group.use-case";
import { DeleteInstanceUseCase } from "../use-cases/delete-instance.use-case";
import { InstanceListUseCase } from "../use-cases/instance-list.use-case";
import { SendButtonTextUseCase } from "../use-cases/send-button-text.use-case";
import { SendGroupTextUseCase } from "../use-cases/send-group-text.use-case";
import { SendTextUseCase } from "../use-cases/send-text.use-case";
import authStorage from "../../../../shared/infra/routes/auth/auth.storage";
import { ConnectInstanceUseCase } from "../use-cases/create-instance.use-case";

export class InstanceController {
  private sessionRepo = new InstanceRepository();

  private connectInstanceUseCase = new ConnectInstanceUseCase(this.sessionRepo);
  private instanceListUseCase = new InstanceListUseCase(this.sessionRepo);
  private deleteInstanceUseCase = new DeleteInstanceUseCase(this.sessionRepo);
  private sendTextUseCase = new SendTextUseCase(this.sessionRepo);
  private sendButtonTextUseCase = new SendButtonTextUseCase(this.sessionRepo);
  private sendGroupTextUseCase = new SendGroupTextUseCase(this.sessionRepo);
  private createGroupUseCase = new CreateGroupUseCase(this.sessionRepo);

  connect = async (req: Request, res: Response) => {
    const instance = req?.body?.sessionId;

    const { qrCode, sessionId, message, bussinessProfile, avatarUrl, profile } =
      await this.connectInstanceUseCase.execute({
        sessionId: instance,
      });

    res.json({
      message,
      sessionId,
      qrCode,
      profile,
      bussinessProfile,
      avatarUrl,
    });
  };

  getAll = async (req: Request, res: Response) => {
    const user = authStorage.get().user();

    const response = await this.instanceListUseCase.execute({ user });

    res.status(200).json(response);
  };

  deleteById = async (req: Request, res: Response) => {
    await this.deleteInstanceUseCase.execute({ sessionId: req.params.id });

    res.status(200).end();
  };

  sendText = async (req: Request, res: Response) => {
    const { number, message } = req.body;

    if (!number || !message) {
      res.status(400).json({ error: "Número e mensagem são obrigatórios" });
    }

    const result = await this.sendTextUseCase.execute({
      message,
      to: number,
      sessionId: req.params.sessionId,
    });
    res.json(result);
  };

  sendBtnText = async (req: Request, res: Response) => {
    const { number, message, buttonContent, buttonText } = req.body;

    if (!number || !message || !buttonContent || !buttonText) {
      res.status(400).json({
        error:
          "Número, mensagem, conteudo do botão e texto do botão são obrigatórios",
      });
    }

    const result = await this.sendButtonTextUseCase.execute({
      message,
      to: number,
      buttonContent,
      buttonText,
      sessionId: req.params.sessionId,
    });
    res.json(result);
  };

  createGroup = async (req: Request, res: Response) => {
    const { subject, numbers } = req.body;

    if (!subject || !numbers) {
      res.status(400).json({ error: "Números e assunto são obrigatórios" });
    }

    const result = await this.createGroupUseCase.execute({
      numbers,
      subject,
      sessionId: req.params.sessionId,
    });
    res.json(result);
  };

  sendGroupTextMessage = async (req: Request, res: Response) => {
    const { groupId, message } = req.body;

    if (!groupId || !message) {
      res
        .status(400)
        .json({ error: "Id do grupo e mensagem são obrigatórios" });
    }

    const result = await this.sendGroupTextUseCase.execute({
      message,
      groupId,
      sessionId: req.params.sessionId,
    });
    res.json(result);
  };
}
