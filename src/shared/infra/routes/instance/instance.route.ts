import { Router } from "express";
import { checkAuth } from "../../middlewares/check-auth.middleware";
import { checkSecret } from "../../middlewares/check-secret.middleware";
import { InstanceController } from "../../../../core/instances/application/controllers/instance.controller";

const instanceRouter: Router = Router();

const controller = new InstanceController();

// Criar conexão com wpp.
instanceRouter.post("/create", checkAuth, controller.connect);

// Lista conexões

instanceRouter.get("/", checkAuth, controller.getAll);

// Lista conexões

instanceRouter.delete("/:id", checkAuth, controller.deleteById);

// Enviar mensagem
instanceRouter.post("/:sessionId/send-text", checkSecret, controller.sendText);

// Enviar mensagem com botão de copiar
instanceRouter.post(
  "/:sessionId/send-btn-text",
  checkSecret,
  controller.sendBtnText
);

//Criar grupo
instanceRouter.post(
  "/:sessionId/create-group",
  checkSecret,
  controller.createGroup
);

// Enviar mensagem em grupo
instanceRouter.post(
  "/:sessionId/send-group-text",
  checkSecret,
  controller.sendGroupTextMessage
);

export default instanceRouter;
