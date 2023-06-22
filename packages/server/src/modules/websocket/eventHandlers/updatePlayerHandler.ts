import { z } from "zod";
import invariant from "tiny-invariant";
import { safe } from "../../../lib/fp";
import { rooms } from "../constants";
import { Server, Socket } from "../types";
import { getSocketData, wrapHandler } from "../utils";
import { playerServices } from "../services";

export { handleUpdatePlayer };

function handleUpdatePlayer(io: Server, socket: Socket) {
  socket.on(
    "player:update",
    wrapHandler(async (args: unknown) => {
      await handleUpdateHasFinishedStepSafely(io, socket, args);
    })
  );
}

async function handleUpdateHasFinishedStepSafely(
  io: Server,
  socket: Socket,
  args: unknown
) {
  await safe(
    async () => {
      const schema = z.object({
        hasFinishedStep: z.boolean(),
      });
      const { hasFinishedStep } = schema.parse(args);

      const { gameId, user } = getSocketData(socket);

      const player = await playerServices.findOne(gameId, user.id);
      invariant(
        player,
        `Could not find player for game ${gameId} and user ${user.id}`
      );

      await playerServices.update(gameId, user.id, {
        hasFinishedStep,
      });

      const playerUpdate = {
        userId: player.userId,
        hasFinishedStep,
      };
      socket.emit("player:update", { updates: [playerUpdate] });
      io.to(rooms.teachers(gameId)).emit("player:update", {
        updates: [playerUpdate],
      });
    },
    { logError: true }
  );
}
