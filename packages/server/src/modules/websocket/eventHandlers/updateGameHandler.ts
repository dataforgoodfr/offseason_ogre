import invariant from "tiny-invariant";
import { z } from "zod";
import { Server, Socket } from "../types";
import { services as gameServices } from "../../games/services";
import { services as playersServices } from "../../players/services";
import * as teamActionsServices from "../../teamActions/services";
import { rooms } from "../constants";
import { wrapHandler } from "../utils";

export { handleUpdateGame };

function handleUpdateGame(io: Server, socket: Socket) {
  socket.on(
    "updateGame",
    wrapHandler(async (args: unknown) => {
      const schema = z.object({
        gameId: z.number(),
        update: z.object({
          step: z.number().optional(),
          isStepActive: z.boolean().optional(),
          status: z.enum(["ready", "draft", "finished"]).optional(),
        }),
      });
      const { gameId, update } = schema.parse(args);

      const game = await gameServices.getDocument(gameId);
      invariant(game, `Could not find game with id ${gameId}`);

      const gameUpdated = await gameServices.update(gameId, update);

      io.to(rooms.game(gameId)).emit("gameUpdated", { update });

      const stepSwitchedToActive =
        !game.isStepActive && gameUpdated.isStepActive;
      const stepSwitchedToInactive =
        game.isStepActive && !gameUpdated.isStepActive;

      const teamIds = gameUpdated.teams.map((team) => team.id);
      const teamActions = await Promise.all(
        teamIds.map((teamId) =>
          teamActionsServices.getOrCreateTeamActions(teamId)
        )
      );
      let hasFinishedStep: boolean | undefined;
      if (stepSwitchedToActive) {
        hasFinishedStep = false;
      } else if (stepSwitchedToInactive) {
        hasFinishedStep = true;
      }

      if (hasFinishedStep != null) {
        await playersServices.updateMany(gameId, { hasFinishedStep });
      }
      teamIds.forEach((teamId, index) => {
        io.to(rooms.team(gameId, teamId)).emit("playerUpdated", {
          update: { hasFinishedStep, teamActions: teamActions[index] },
        });
      });

      const gameLatestUpdate = await gameServices.getDocument(gameId);
      io.to(rooms.game(gameId)).emit("gameUpdated", {
        update: gameLatestUpdate,
      });
    })
  );
}
