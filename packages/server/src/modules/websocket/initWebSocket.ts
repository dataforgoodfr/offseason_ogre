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
      gameServices.initState({ gameId: +gameId }).then((state) => {
        socket.emit("resetGameState", state);
      });
    });
  });
  return { httpServer };
}
