import invariant from "tiny-invariant";
import { z } from "zod";
import { Server, Socket } from "../types";
import { rooms } from "../constants";
import { getSocketData, hasFinishedStep, wrapHandler } from "../utils";
import { gameServices, playerServices } from "../services";
import { buildPermissions } from "../router/permissions";

export { handleUpdateGame };

function handleUpdateGame(io: Server, socket: Socket) {
  socket.on(
    "game:update",
    wrapHandler(
      async () => {
        const { gameId, user, role } = getSocketData(socket);
        const permissions = buildPermissions(user, role);
        invariant(
          permissions.canUpdateGame,
          `User ${user.id} does not have permissions to update game ${gameId}`
        );
      },
      async (args: unknown) => {
        const schema = z.object({
          update: z.object({
            step: z.number().optional(),
            lastFinishedStep: z.number().optional(),
            status: z
              .enum(["ready", "draft", "playing", "finished"])
              .optional(),
          }),
        });
        const { update } = schema.parse(args);

        const { gameId } = getSocketData(socket);
        const game = await gameServices.findOne(gameId);
        invariant(game, `Could not find game with id ${gameId}`);

        const gameUpdated = await gameServices.queries.update({
          where: { id: gameId },
          data: update,
          include: {
            players: {
              select: {
                userId: true,
              },
            },
          },
        });

        io.to(rooms.game(gameId)).emit("game:update", { update });

        const hasGameFinishedStep = hasFinishedStep(gameUpdated);
        const hasPreviousGameFinishedStep = hasFinishedStep(game);

        if (hasPreviousGameFinishedStep !== hasGameFinishedStep) {
          await playerServices.updateMany(gameId, {
            hasFinishedStep: hasGameFinishedStep,
          });
        }

        const playerUpdates = gameUpdated.players.map((p) => ({
          userId: p.userId,
          hasFinishedStep: hasGameFinishedStep,
        }));

        playerUpdates.forEach((playerUpdate) => {
          io.to(rooms.user(gameId, playerUpdate.userId)).emit("player:update", {
            updates: [playerUpdate],
          });
        });
        io.to(rooms.teachers(gameId)).emit("player:update", {
          updates: playerUpdates,
        });
      }
    )
  );
}
