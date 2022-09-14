/* eslint-disable no-param-reassign */
import cookie from "cookie";
import { z } from "zod";
import invariant from "tiny-invariant";
import { services as gameServices } from "../../games/services";
import { services as playersServices } from "../../players/services";
import { services as usersServices } from "../../users/services";
import * as playerActionsServices from "../../actions/services/playerActions";
import * as teamActionsServices from "../../teamActions/services";
import { Server, Socket } from "../types";
import { rooms } from "../constants";
import { safe } from "../../../lib/fp";

export { handleJoinGame };

function handleJoinGame(io: Server, socket: Socket) {
  socket.on("joinGame", async (rawGameId: unknown) => {
    await safe(
      async () => {
        const gameId = z.number().parse(rawGameId);
        socket.join(`${gameId}`);
        const gameState = await gameServices.initState({ gameId });
        socket.emit("resetGameState", gameState);

        const cookies = cookie.parse(socket.handshake.headers.cookie || "");
        const user = await usersServices.authenticateUser(
          cookies?.authentificationToken
        );

        socket.data.gameId = gameId;
        socket.data.user = user;

        const game = await gameServices.getDocument(gameId);
        const isPlayer = game?.teacherId !== user.id;

        if (isPlayer) {
          const player = await playersServices.find(gameId, user.id);
          invariant(
            player,
            `Could not find player with game id ${gameId} and user id ${user.id}`
          );

          socket.join(rooms.players(gameId));
          socket.join(rooms.team(gameId, player.teamId));

          const [playerActions, teamActions] = await Promise.all([
            playerActionsServices.getOrCreatePlayerActions(gameId, user.id),
            teamActionsServices.getOrCreateTeamActions(player.teamId),
          ]);

          socket.emit("playerActionsUpdated", { playerActions });
          socket.emit("playerUpdated", {
            update: {
              hasFinishedStep: player?.hasFinishedStep,
              teamActions,
            },
          });
        } else {
          socket.join(rooms.teachers(gameId));
        }
      },
      { logError: true }
    );
  });
}
