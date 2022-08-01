import { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { handleJoinGame } from "./eventHandlers/joinGameHandler";
import { handleUpdateGame } from "./eventHandlers/updateGameHandler";
import { updatePlayerActions } from "./eventHandlers/updatePlayerActionsHandler";

export { initWebSocket };

function initWebSocket({ app }: { app: Express }) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    handleJoinGame(socket);
    handleUpdateGame(socket);
    updatePlayerActions(socket);
  });
  return { httpServer };
}
