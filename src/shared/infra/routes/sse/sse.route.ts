import { Router } from "express";
import { getEmitter } from "../../events/sse-event.emitter";

const sseRouter = Router();

sseRouter.get("/instance/:instanceId/status", (req, res) => {
  const { instanceId } = req.params as any;
  const emitter = getEmitter(instanceId);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const onConnected = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  emitter.on("connected", onConnected);

  req.on("close", () => {
    emitter.off("connected", onConnected);
  });
});

export default sseRouter;
