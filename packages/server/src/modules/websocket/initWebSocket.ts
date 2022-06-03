import { Express } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { z } from "zod";
import { services as gameServices } from "../games/services";
import { controllers as gameControllers } from "../games/controllers";

export { initWebSocket };

function initWebSocket({ app }: { app: Express }) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    socket.on("joinGame", joinGameSocket(socket));
    socket.on("updateStep", updateStep(socket));
  });
  return { httpServer };
}

function joinGameSocket(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): (...args: any[]) => void {
  return (rawGameId: unknown) => {
    const gameId = z.number().parse(rawGameId);
    socket.join(`${gameId}`);
    gameServices
      .initState({ gameId })
      .then((state) => socket.emit("resetGameState", state));
  };
}

function updateStep(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): (...args: any[]) => void {
  return (rawGameId: number) => {
    const gameId = z.number().parse(rawGameId);
    gameControllers
      .updateGameStep({ gameId })
      .then((gameId) => gameServices.initState({ gameId }))
      .then((state) => socket.emit("resetGameState", state));
  };
}
