/* eslint-disable no-param-reassign */
import { z } from "zod";
import invariant from "tiny-invariant";
import { Game } from "@prisma/client";
import { services as usersServices } from "../../users/services";
import { GameInitEmitted, Server, Socket } from "../types";
import { rooms } from "../constants";
import { wrapHandler } from "../utils";
import {
  actionServices,
  gameServices,
  playerServices,
  productionActionServices,
  roleServices,
  teamServices,
} from "../services";
import { BusinessError } from "../../utils/businessError";
import { User } from "../../users/types";

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

      const userRole = await roleServices.findOne(user.roleId);
      invariant(userRole, `User ${user.id} has no roles`);

      socket.data.gameId = gameId;
      socket.data.user = user;
      socket.data.role = userRole;

      let gameInitData: GameInitEmitted;
      if (await hasPlayerAccess(user, game)) {
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
      } else if (await hasTeacherAccess(user, game)) {
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
      } else {
        socket.emit("game:leave");
        throw new BusinessError(
          `User ${user.id} is not authorized to join game ${game.id}`
        );
      }

      socket.emit("game:init", gameInitData);
    })
  );
}

async function hasTeacherAccess(user: User, game: Game) {
  if (game.teacherId === user.id) {
    return true;
  }

  // TODO: protect game access with a list of allowed teachers?
  const userRole = await roleServices.findOne(user.roleId);
  if (["admin", "teacher"].includes(userRole?.name || "")) {
    return true;
  }

  return false;
}

async function hasPlayerAccess(user: User, game: Game) {
  const player = await playerServices.findOne(game.id, user.id);
  if (player) {
    return true;
  }

  return false;
}
