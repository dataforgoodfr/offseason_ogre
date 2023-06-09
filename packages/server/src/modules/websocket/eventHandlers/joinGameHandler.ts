/* eslint-disable no-param-reassign */
import { z } from "zod";
import invariant from "tiny-invariant";
import { services as playersServices } from "../../players/services";
import { services as teamsServices } from "../../teams/services";
import { services as usersServices } from "../../users/services";
import * as actionsServices from "../../actions/services";
import * as productionActionsServices from "../../productionActions/services";
import { Server, Socket } from "../types";
import { rooms } from "../constants";
import { wrapHandler } from "../utils";
import { NO_TEAM } from "../../teams/constants/teams";
import { gameServices } from "../services";

export { handleJoinGame };

function handleJoinGame(io: Server, socket: Socket) {
  socket.on(
    "game:join",
    wrapHandler(async (rawGameId: unknown) => {
      const token = socket.handshake.auth?.token || "";
      const user = await usersServices.authenticateUser(token);

      const gameId = z.number().parse(rawGameId);
      const game = await gameServices.findOne(gameId);
      invariant(game, `Could not find game ${gameId}`);

      socket.data.gameId = gameId;
      socket.data.user = user;

      const isPlayer = game?.teacherId !== user.id;
      if (isPlayer) {
        const player = await playersServices.queries.findUnique({
          where: {
            userId_gameId: {
              gameId,
              userId: user.id,
            },
          },
          include: {
            user: true,
            actions: {
              orderBy: {
                actionId: "asc",
              },
            },
            profile: {
              include: {
                personalization: true,
              },
            },
          },
        });
        invariant(
          player,
          `Could not find player for game ${gameId} and user ${user.id}`
        );

        const [team, consumptionActions, productionActions] = await Promise.all(
          [
            teamsServices.queries.findFirst({
              where: {
                id: player.teamId,
              },
              include: {
                actions: {
                  orderBy: {
                    actionId: "asc",
                  },
                },
              },
            }),
            actionsServices.getAll(),
            productionActionsServices.getAll(),
          ]
        );
        invariant(team, `Could not find team ${player.teamId}`);

        socket.join(`${gameId}`);
        socket.join(rooms.user(gameId, user.id));
        socket.join(rooms.players(gameId));
        socket.join(rooms.team(gameId, player.teamId));

        socket.emit("game:init", {
          game,
          consumptionActions,
          productionActions,
          players: [player],
          teams: [team],
        });
      } else {
        const [players, teams, consumptionActions, productionActions] =
          await Promise.all([
            playersServices.queries.findMany({
              where: { gameId },
              include: {
                user: true,
                actions: true,
                profile: {
                  include: {
                    personalization: true,
                  },
                },
              },
            }),
            teamsServices.queries.findMany({
              where: {
                AND: {
                  gameId,
                  name: {
                    not: {
                      equals: NO_TEAM,
                    },
                  },
                },
              },
              include: {
                actions: true,
              },
              orderBy: {
                id: "asc",
              },
            }),
            actionsServices.getAll(),
            productionActionsServices.getAll(),
          ]);

        socket.join(`${gameId}`);
        socket.join(rooms.user(gameId, user.id));
        socket.join(rooms.teachers(gameId));

        socket.emit("game:init", {
          game,
          consumptionActions,
          productionActions,
          players,
          teams,
        });
      }
    })
  );
}
