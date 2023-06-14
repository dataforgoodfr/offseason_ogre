/* eslint-disable no-param-reassign */
import { z } from "zod";
import invariant from "tiny-invariant";
import { services as usersServices } from "../../users/services";
import { GameInitEmitted, Server, Socket } from "../types";
import { rooms } from "../constants";
import { wrapHandler } from "../utils";
import {
  actionServices,
  gameServices,
  playerServices,
  productionActionServices,
  teamServices,
} from "../services";

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

      let gameInitData: GameInitEmitted;
      if (isPlayer) {
        const player = await playerServices.findOne(gameId, user.id, {
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
            teamServices.findOne(player.teamId, {
              include: {
                actions: {
                  orderBy: {
                    actionId: "asc",
                  },
                },
              },
            }),
            actionServices.findAll(),
            productionActionServices.findAll(),
          ]
        );
        invariant(team, `Could not find team ${player.teamId}`);

        socket.join(`${gameId}`);
        socket.join(rooms.user(gameId, user.id));
        socket.join(rooms.players(gameId));
        socket.join(rooms.team(gameId, player.teamId));

        gameInitData = {
          game,
          consumptionActions,
          productionActions,
          players: [player],
          teams: [team],
        };
      } else {
        const [players, teams, consumptionActions, productionActions] =
          await Promise.all([
            playerServices.findMany(gameId, {
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
            teamServices.findMany(gameId, {
              include: {
                actions: true,
              },
            }),
            actionServices.findAll(),
            productionActionServices.findAll(),
          ]);

        socket.join(`${gameId}`);
        socket.join(rooms.user(gameId, user.id));
        socket.join(rooms.teachers(gameId));

        gameInitData = {
          game,
          consumptionActions,
          productionActions,
          players,
          teams,
        };
      }

      socket.emit("game:init", gameInitData);
    })
  );
}
