import { Router } from "express";
import { instanceEvents } from "../../events/sse-event.emitter";

const sseRouter = Router();

sseRouter.get("/instance/:instanceId/status", (req, res) => {
  const { instanceId } = req.params;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  console.log(`👂 SSE aguardando conexão da instância ${instanceId}`);

  const onConnected = (data: { instanceId: string }) => {
    if (data.instanceId === instanceId) {
      res.write(`data: ${JSON.stringify({ status: "connected" })}\n\n`);
      console.log(`📡 SSE enviado para ${instanceId}`);
      // Você pode encerrar ou manter aberto dependendo do fluxo
      res.end(); // opcional
    }
  };

  instanceEvents.on("instance_connected", onConnected);

  // Limpeza ao desconectar o cliente
  req.on("close", () => {
    instanceEvents.removeListener("instance_connected", onConnected);
    console.log(`❌ SSE desconectado para ${instanceId}`);
  });
});

export default sseRouter;
