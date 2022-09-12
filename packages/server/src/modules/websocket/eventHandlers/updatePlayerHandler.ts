import { z } from "zod";
import { safe } from "../../../lib/fp";
import { services as gameServices } from "../../games/services";
import { services as playersServices } from "../../players/services";
import { rooms } from "../constants";
import { Server, Socket } from "../types";

export { handleUpdatePlayer };

function handleUpdatePlayer(io: Server, socket: Socket) {
  socket.on("updatePlayer", async (args: unknown) => {
    await handleUpdateHasFinishedStepSafely(io, socket, args);
  });
}

async function handleUpdateHasFinishedStepSafely(
  io: Server,
  socket: Socket,
  args: unknown
) {
  await safe(
    async () => {
      const schema = z.object({
        gameId: z.number(),
        hasFinishedStep: z.boolean(),
      });
      const { gameId, hasFinishedStep } = schema.parse(args);

      const { user } = socket.data;
      if (!user) {
        throw new Error(`User not authenticated`);
      }

      let player = await playersServices.find(gameId, user.id);
      if (!player) {
        throw new Error(
          `Could not find player for gameId ${gameId} and userId ${user.id}`
        );
      }

      player = await playersServices.update(gameId, user.id, {
        hasFinishedStep,
      });

      const game = await gameServices.getDocument(gameId);

      io.to(rooms.teachers(gameId)).emit("gameUpdated", {
        update: game,
      });
      socket.emit("playerUpdated", {
        update: {
          hasFinishedStep,
        },
      });
    },
    { logError: true }
  );
}
