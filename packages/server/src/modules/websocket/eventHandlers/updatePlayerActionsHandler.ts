import cookie from "cookie";
import { Socket } from "socket.io";
import { z } from "zod";
import { services as usersServices } from "../../users/services";
import * as playerActionsServices from "../../actions/services/playerActions";
import { GameStep, STEPS } from "../../../constants/steps";
import { PlayerActions } from "../../actions/types";

export { updatePlayerActions };

function updatePlayerActions(socket: Socket) {
  socket.on("updatePlayerActions", async (args: unknown) => {
    const schema = z.object({
      gameId: z.number(),
      step: z.number(),
      playerActions: z
        .object({
          id: z.number(),
          isPerformed: z.boolean(),
        })
        .array()
        .min(1),
    });

    const {
      gameId,
      step: stepId,
      playerActions: playerActionsUpdate,
    } = schema.parse(args);

    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const user = await usersServices.authenticateUser(
      cookies?.authentificationToken
    );

    const playerActionsBeforeUpdate = await computePlayerActionsBeforeUpdate(
      gameId,
      user.id,
      stepId,
      playerActionsUpdate
    );

    if (!canUpdatePlayerActions(playerActionsBeforeUpdate, STEPS[stepId])) {
      socket.emit("actionPointsLimitExceeded");
      return;
    }

    const playerActions = await playerActionsServices.updatePlayerActions(
      user.id,
      playerActionsBeforeUpdate
    );

    socket.emit("playerActionsUpdated", {
      playerActions,
    });
  });
}

async function computePlayerActionsBeforeUpdate(
  gameId: number,
  userId: number,
  step: number,
  playerActionsUpdate: {
    isPerformed: boolean;
    id: number;
  }[]
): Promise<PlayerActions[]> {
  const idToPlayerActions = Object.fromEntries(
    playerActionsUpdate.map((playerAction) => [playerAction.id, playerAction])
  );

  const playerActions = (
    await playerActionsServices.getOrCreatePlayerActions(gameId, userId)
  )
    .filter((playerAction) => playerAction.action.step === step)
    .map((playerAction) => ({
      ...playerAction,
      isPerformed: idToPlayerActions[playerAction.id]
        ? idToPlayerActions[playerAction.id].isPerformed
        : playerAction.isPerformed,
    }));

  return playerActions;
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
