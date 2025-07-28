import { Router } from "express";
import { instanceEvents } from "../../events/sse-event.emitter";

const sseRouter: Router = Router();

sseRouter.get("/instance/:sessionId/status", (req, res) => {
  const { sessionId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  console.log(`👂 SSE aguardando conexão da instância ${sessionId}`);

  const onConnected = (data: { sessionId: string }) => {
    if (data.sessionId === sessionId) {
      res.write(`data: ${JSON.stringify({ status: "connected" })}\n\n`);
      console.log(`📡 SSE enviado para ${sessionId}`);
      // Você pode encerrar ou manter aberto dependendo do fluxo
      res.end(); // opcional
    }
  };

  instanceEvents.on("instance_connected", onConnected);

  // Limpeza ao desconectar o cliente
  req.on("close", () => {
    instanceEvents.removeListener("instance_connected", onConnected);
    console.log(`❌ SSE desconectado para ${sessionId}`);
  });
});

export default sseRouter;
