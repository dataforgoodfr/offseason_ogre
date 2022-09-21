import { Game, Players } from "@prisma/client";
import invariant from "tiny-invariant";
import { z } from "zod";
import { safe } from "../../../lib/fp";
import { services as gameServices } from "../../games/services";
import { services as playersServices } from "../../players/services";
import { services as teamServices } from "../../teams/services";
import * as teamActionsServices from "../../teamActions/services";
import { rooms } from "../constants";
import { Server, Socket } from "../types";
import { getSocketData, wrapHandler } from "../utils";

export { handleUpdateTeam };

function handleUpdateTeam(io: Server, socket: Socket) {
  socket.on(
    "updateTeam",
    wrapHandler(async (args: unknown) => {
      await handleUpdateTeamSafely(io, socket, args);
    })
  );
}

async function handleUpdateTeamSafely(
  io: Server,
  socket: Socket,
  args: unknown
) {
  await safe(
    async () => {
      const schema = z.object({
        step: z.number(),
        teamActions: z
          .object({
            id: z.number(),
            value: z.number(),
          })
          .array()
          .min(1)
          .optional(),
        scenarioName: z.string().optional(),
      });

      const { teamActions: teamActionsUpdate, scenarioName } =
        schema.parse(args);
      const { gameId, user } = getSocketData(socket);

      const { game, player } = await getPlayerAndGame(gameId, user.id);

      if (teamActionsUpdate && teamActionsUpdate.length !== 0) {
        const areUpdatable = !player.hasFinishedStep && game?.isStepActive;
        invariant(
          areUpdatable,
          `Player can't update team actions when current step is finished or inactive`
        );

        const validTeamActionsUpdate = await filterValidTeamActionsUpdate(
          game.step,
          player.teamId,
          teamActionsUpdate
        );

        const teamActions = await teamActionsServices.updateTeamActions(
          player.teamId,
          validTeamActionsUpdate.map((update) => ({
            id: update.id,
            value: update.value,
            isTouched: true,
          }))
        );

        io.to(rooms.team(gameId, player.teamId)).emit("playerUpdated", {
          update: { teamActions },
        });
      }

      if (scenarioName) {
        const updatedTeam = await teamServices.update(player.teamId, {
          scenarioName,
        });
        io.to(rooms.team(gameId, updatedTeam.id)).emit("gameUpdated", {
          update: game,
        });
      }

      const gameLatestUpdate = await gameServices.getDocument(gameId);

      if (scenarioName) {
        io.to(rooms.team(gameId, player.teamId)).emit("gameUpdated", {
          update: gameLatestUpdate,
        });
      }

      io.to(rooms.teachers(gameId)).emit("gameUpdated", {
        update: gameLatestUpdate,
      });
    },
    { logError: true }
  );
}

async function getPlayerAndGame(
  gameId: number,
  userId: number
): Promise<{ game: Game; player: Players }> {
  const [game, player] = await Promise.all([
    gameServices.getDocument(gameId),
    playersServices.find(gameId, userId),
  ]);
  invariant(game, `Could not find game for gameId ${gameId}`);
  invariant(
    player,
    `Could not find player for gameId ${gameId} and userId ${userId}`
  );

  return { game, player };
}

async function filterValidTeamActionsUpdate(
  currentStep: number,
  teamId: number,
  teamActionsUpdate: {
    id: number;
    value: number;
  }[]
) {
  const teamActionIds = teamActionsUpdate.map((update) => update.id);
  const teamActions = await teamActionsServices.getMany({
    ids: teamActionIds,
    teamId,
  });
  const teamActionIdToUpdatable = Object.fromEntries(
    teamActions
      .filter(
        (teamAction) =>
          teamAction.action.step === currentStep && teamAction.action.isPlayable
      )
      .map((teamAction) => [teamAction.id, true])
  );

  return teamActionsUpdate.filter(
    (update) => teamActionIdToUpdatable[update.id]
  );
}
