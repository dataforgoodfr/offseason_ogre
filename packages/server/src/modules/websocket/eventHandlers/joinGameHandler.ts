/* eslint-disable no-param-reassign */
import cookie from "cookie";
import { z } from "zod";
import { services as gameServices } from "../../games/services";
import { services as playersServices } from "../../players/services";
import { services as usersServices } from "../../users/services";
import * as playerActionsServices from "../../actions/services/playerActions";
import { Socket } from "../types";
import { rooms } from "../constants";

export { handleJoinGame };

function handleJoinGame(socket: Socket) {
  socket.on("joinGame", async (rawGameId: unknown) => {
    const gameId = z.number().parse(rawGameId);
    socket.join(`${gameId}`);
    const gameState = await gameServices.initState({ gameId });
    socket.emit("resetGameState", gameState);

    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const user = await usersServices.authenticateUser(
      cookies?.authentificationToken
    );

    socket.data.user = user;

    const game = await gameServices.getDocument(gameId);
    const isPlayer = game?.teacherId !== user.id;

    if (isPlayer) {
      socket.join(rooms.players);
      await playerActionsServices.getOrCreatePlayerActions(gameId, user.id);

      const player = await playersServices.find(gameId, user.id);

      socket.emit("playerActionsUpdated", { playerActions: player?.actions });
      socket.emit("playerUpdated", {
        update: {
          hasFinishedStep: player?.hasFinishedStep,
        },
      });
    } else {
      socket.join(rooms.teachers);
    }
  });
}
