import { z } from "zod";
import { Server, Socket } from "../types";
import { services as gameServices } from "../../games/services";
import { services as playersServices } from "../../players/services";
import { rooms } from "../constants";

export { handleUpdateGame };

function handleUpdateGame(io: Server, socket: Socket) {
  socket.on("updateGame", async (args: unknown) => {
    const schema = z.object({
      gameId: z.number(),
      update: z.object({
        step: z.number().optional(),
        isStepActive: z.boolean().optional(),
      }),
    });
    const { gameId, update } = schema.parse(args);

    let game = await gameServices.getDocument(gameId);
    if (!game) {
      throw new Error(`Could not find game with id ${gameId}`);
    }

    const wasStepActive = game.isStepActive;
    game = await gameServices.update(gameId, update);

    socket.broadcast.to(rooms.game(gameId)).emit("gameUpdated", { update });

    const stepSwitchedToActive = !wasStepActive && game.isStepActive;
    const stepSwitchedToInactive = wasStepActive && !game.isStepActive;
    if (stepSwitchedToActive) {
      await playersServices.updateMany(gameId, { hasFinishedStep: false });
      io.to(rooms.players(gameId)).emit("playerUpdated", {
        update: { hasFinishedStep: false },
      });
    } else if (stepSwitchedToInactive) {
      await playersServices.updateMany(gameId, { hasFinishedStep: true });
      io.to(rooms.players(gameId)).emit("playerUpdated", {
        update: { hasFinishedStep: true },
      });
    }

    game = await gameServices.getDocument(gameId);
    io.to(rooms.game(gameId)).emit("gameUpdated", { update: game });
  });
}
