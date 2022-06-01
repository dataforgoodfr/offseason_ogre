import { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { services as gameServices } from "../games/services";

export { initWebSocket };

function initWebSocket({ app }: { app: Express }) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {});

  io.on("connection", (socket) => {
    socket.on("joinGame", (gameId: string) => {
      socket.join(gameId);
      gameServices.initState({ gameId: +gameId }).then((state) => {
        console.log("state", state);
        socket.emit("resetGameState", state);
      });
    });
  });
  return { httpServer };
}
