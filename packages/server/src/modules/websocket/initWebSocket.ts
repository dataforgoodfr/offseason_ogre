import { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { handleJoinGame } from "./eventHandlers/joinGameHandler";
import { handleReadProfile } from "./eventHandlers/readProfileHandler";
import { handleUpdateGame } from "./eventHandlers/updateGameHandler";
import { updatePlayerActions } from "./eventHandlers/updatePlayerActionsHandler";
import { handleUpdatePlayer } from "./eventHandlers/updatePlayerHandler";
import { handleUpdateProfile } from "./eventHandlers/updateProfileHandler";
import { handleUpdateTeam } from "./eventHandlers/updateTeamHandler";
import { redis } from "../redis/services";
import { corsOptions } from "../../middlewares/cors";

export { initWebSocket };

async function initWebSocket({ app }: { app: Express }) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: corsOptions,
  });
  const { pubClient, subClient } = await redis.getPubSubClients();

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
