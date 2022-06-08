import { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { z } from "zod";
import { services as gameServices } from "../games/services";

export { initWebSocket };

function initWebSocket({ app }: { app: Express }) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    socket.on("joinGame", (rawGameId: unknown) => {
      const gameId = z.number().parse(rawGameId);
      socket.join(`${gameId}`);
      gameServices
        .initState({ gameId })
        .then((state) => socket.emit("resetGameState", state));
    });
    socket.on("updateGame", (args: unknown) => {
      const schema = z.object({
        gameId: z.number(),
        update: z.object({ step: z.number().optional() }),
      });
      const { gameId, update } = schema.parse(args);
      gameServices.update(gameId, update).then(() => {
        socket.broadcast
          .to(`${gameId}`)
          .emit("gameUpdated", { gameId, update });
      });
    });
  });
  return { httpServer };
}
