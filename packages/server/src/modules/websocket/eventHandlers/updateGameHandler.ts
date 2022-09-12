import invariant from "tiny-invariant";
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

    const game = await gameServices.getDocument(gameId);
    invariant(game, `Could not find game with id ${gameId}`);

    const gameUpdated = await gameServices.update(gameId, update);

    socket.broadcast.to(rooms.game(gameId)).emit("gameUpdated", { update });

    const stepSwitchedToActive = !game.isStepActive && gameUpdated.isStepActive;
    const stepSwitchedToInactive =
      game.isStepActive && !gameUpdated.isStepActive;
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

    const gameLatestUpdate = await gameServices.getDocument(gameId);
    io.to(rooms.game(gameId)).emit("gameUpdated", { update: gameLatestUpdate });
  });
}
