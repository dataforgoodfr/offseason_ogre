import { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { handleJoinGame } from "./eventHandlers/joinGameHandler";
import { handleReadProfile } from "./eventHandlers/readProfileHandler";
import { handleUpdateGame } from "./eventHandlers/updateGameHandler";
import { updatePlayerActions } from "./eventHandlers/updatePlayerActionsHandler";
import { handleUpdatePlayer } from "./eventHandlers/updatePlayerHandler";
import { handleUpdateProfile } from "./eventHandlers/updateProfileHandler";
import { handleUpdateTeam } from "./eventHandlers/updateTeamHandler";

export { initWebSocket };

async function initWebSocket({ app }: { app: Express }) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {});

  const pubClient = createClient({ url: process.env.REDIS_URL });
  const subClient = pubClient.duplicate();
  await Promise.all([pubClient.connect(), subClient.connect()]);

  io.adapter(createAdapter(pubClient, subClient));
  io.on("connection", (socket) => {
    handleJoinGame(io, socket);
    handleUpdateGame(io, socket);
    updatePlayerActions(io, socket);
    handleUpdatePlayer(io, socket);
    handleReadProfile(io, socket);
    handleUpdateProfile(io, socket);
    handleUpdateTeam(io, socket);
  });
  return { httpServer };
}
