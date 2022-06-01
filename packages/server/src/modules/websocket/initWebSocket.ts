import { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export { initWebSocket };

function initWebSocket({ app }: { app: Express }) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    /* options */
  });

  io.on("connection", (socket) => {
    socket.on("joinGame", (gameId) => {
      socket.join(gameId);
    });
  });
  return { httpServer };
}
