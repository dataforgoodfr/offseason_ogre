import invariant from "tiny-invariant";
import { z } from "zod";
import { safe } from "../../../lib/fp";
import { rooms } from "../constants";
import { Server, Socket } from "../types";
import {
  getSocketData,
  hasFinishedStep,
  isGameFinished,
  wrapHandler,
} from "../utils";
import {
  gameServices,
  playerServices,
  teamActionServices,
  teamServices,
} from "../services";

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

      invariant(
        !isGameFinished(game),
        `User ${player.userId} can't update team ${player.teamId} because game ${player.gameId} is finished`
      );

      if (teamActionsUpdate && teamActionsUpdate.length !== 0) {
        const areUpdatable = !player.hasFinishedStep && !hasFinishedStep(game);
        invariant(
          areUpdatable,
          `Player can't update team actions when current step is finished or inactive`
        );

        const validTeamActionsUpdate = await filterValidTeamActionsUpdate(
          game.step,
          player.teamId,
          teamActionsUpdate
        );

        const teamActions = await teamActionServices.updateMany(
          player.teamId,
          validTeamActionsUpdate.map((update) => ({
            id: update.id,
            value: update.value,
            isTouched: true,
          }))
        );

        io.to(rooms.team(gameId, player.teamId)).emit("team:update", {
          updates: [
            {
              id: player.teamId,
              actions: teamActions,
            },
          ],
        });
        io.to(rooms.teachers(gameId)).emit("team:update", {
          updates: [
            {
              id: player.teamId,
              actions: teamActions,
            },
          ],
        });
      }

      if (scenarioName) {
        const updatedTeam = await teamServices.update(player.teamId, {
          scenarioName,
        });
        io.to(rooms.team(gameId, updatedTeam.id)).emit("team:update", {
          updates: [updatedTeam],
        });
        io.to(rooms.teachers(gameId)).emit("team:update", {
          updates: [updatedTeam],
        });
      }
    },
    { logError: true }
  );
}

async function getPlayerAndGame(gameId: number, userId: number) {
  const [game, player] = await Promise.all([
    gameServices.findOne(gameId),
    playerServices.findOne(gameId, userId),
  ]);
  invariant(game, `Could not find game ${gameId}`);
  invariant(
    player,
    `Could not find player for game ${gameId} and user ${userId}`
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
  const teamActions = await teamActionServices.findManyWithActions(
    teamActionIds,
    teamId
  );
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
