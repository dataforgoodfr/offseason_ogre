import { z } from "zod";
import invariant from "tiny-invariant";
import { Server, Socket } from "../types";
import { GameStep, STEPS } from "../../../constants/steps";
import { PlayerActions } from "../../actions/types";
import { rooms } from "../constants";
import { getSocketData, wrapHandler } from "../utils";
import { playerActionServices, playerServices } from "../services";

export { updatePlayerActions };

function updatePlayerActions(io: Server, socket: Socket) {
  socket.on(
    "player-actions:update",
    wrapHandler(async (args: unknown) => {
      const schema = z.object({
        step: z.number(),
        playerActions: z
          .object({
            id: z.number(),
            isPerformed: z.boolean(),
          })
          .array()
          .min(1),
      });

      const { step: stepId, playerActions: playerActionsUpdate } =
        schema.parse(args);

      const { gameId, user } = getSocketData(socket);

      const player = await playerServices.findOne(gameId, user.id);
      invariant(
        player,
        `Could not find player for gameId ${gameId} and userId ${user.id}`
      );
      invariant(
        !player.hasFinishedStep,
        `Player has already finished the current step`
      );

      const lastChosenPlayerActions = await computeLastChosenPlayerActions(
        gameId,
        user.id,
        stepId,
        playerActionsUpdate
      );

      if (
        !canUpdatePlayerActions(
          lastChosenPlayerActions.playerActionsAtCurrentStep,
          STEPS[stepId]
        )
      ) {
        socket.emit("player-actions:action-points-limit-exceeded", {
          updates: [
            {
              userId: player.userId,
              actionPointsLimitExceeded: true,
            },
          ],
        });
        return;
      }

      const playerActions = await playerActionServices.updateMany(
        user.id,
        lastChosenPlayerActions.playerActionsFreshlyUpdated
      );

      const updates = [
        {
          userId: player.userId,
          actions: playerActions,
        },
      ];
      socket.emit("player-actions:update", { updates });
      io.to(rooms.teachers(gameId)).emit("player-actions:update", { updates });
    })
  );
}

async function computeLastChosenPlayerActions(
  gameId: number,
  userId: number,
  step: number,
  playerActionsUpdate: {
    isPerformed: boolean;
    id: number;
  }[]
) {
  const playerActionsUpdateById = Object.fromEntries(
    playerActionsUpdate.map((playerAction) => [playerAction.id, playerAction])
  );

  const playerActionsAtCurrentStep = (
    await playerActionServices.findManyWithActions(gameId, userId)
  )
    .filter((playerAction) => playerAction.action.step === step)
    .map((playerAction) => ({
      ...playerAction,
      isPerformed: playerActionsUpdateById[playerAction.id]
        ? playerActionsUpdateById[playerAction.id].isPerformed
        : playerAction.isPerformed,
    }));

  const playerActionsFreshlyUpdated = playerActionsAtCurrentStep.filter(
    (playerAction) => !!playerActionsUpdateById[playerAction.id]
  );

  return {
    playerActionsAtCurrentStep,
    playerActionsFreshlyUpdated,
  };
}

function canUpdatePlayerActions(
  playerActions: PlayerActions[],
  step: GameStep
): boolean {
  const remainingActionPoints = playerActions.reduce(
    (remainder, playerAction) =>
      playerAction.isPerformed
        ? remainder - playerAction.action.actionPointCost
        : remainder,
    step.availableActionPoints || 0
  );

  return remainingActionPoints >= 0;
}
