import { Socket } from "socket.io";
import { z } from "zod";
import { services as gameServices } from "../../games/services";

export { handleUpdateGame };

function handleUpdateGame(socket: Socket) {
  socket.on("updateGame", async (args: unknown) => {
    const schema = z.object({
      gameId: z.number(),
      update: z.object({
        step: z.number().optional(),
        isStepActive: z.boolean().optional(),
      }),
    });
    const { gameId, update } = schema.parse(args);
    await gameServices.update(gameId, update);
    socket.broadcast.to(`${gameId}`).emit("gameUpdated", { gameId, update });
  });
}
