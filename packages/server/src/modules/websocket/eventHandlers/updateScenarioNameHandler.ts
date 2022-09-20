import { z } from "zod";
import { safe } from "../../../lib/fp";
import { services as gameServices } from "../../games/services";
import { services as teamServices } from "../../teams/services";
import { rooms } from "../constants";
import { Server, Socket } from "../types";
import { wrapHandler } from "../utils";

export { handleUpdateScenarioName };

function handleUpdateScenarioName(io: Server, socket: Socket) {
  socket.on(
    "updateScenarioName",
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
        gameId: z.number(),
        teamId: z.number(),
        scenarioName: z.string(),
      });
      const { gameId, teamId, scenarioName } = schema.parse(args);

      const { user } = socket.data;
      if (!user) {
        throw new Error(`User not authenticated`);
      }

      const team = await teamServices.get(teamId);
      if (!team) {
        throw new Error(
          `Could not find team for gameId ${gameId} and teamId ${teamId}`
        );
      }

      const updatedTeam = await teamServices.updateScenarioName(
        teamId,
        scenarioName
      );

      const game = await gameServices.getDocument(gameId);
      io.to(rooms.team(gameId, updatedTeam.id)).emit("teamUpdated", {
        update: { scenarioName },
      });
      io.to(rooms.teachers(gameId)).emit("gameUpdated", {
        update: game,
      });
    },
    { logError: true }
  );
}
