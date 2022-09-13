import { z } from "zod";
import { Server, Socket } from "../types";
import { services as gameServices } from "../../games/services";
import { services as playersServices } from "../../players/services";
import * as playerActionsServices from "../../actions/services/playerActions";
import { GameStep, STEPS } from "../../../constants/steps";
import { PlayerActions } from "../../actions/types";
import { rooms } from "../constants";
import { getSocketData } from "../utils";

export { updatePlayerActions };

function updatePlayerActions(io: Server, socket: Socket) {
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

    const { step: stepId, playerActions: playerActionsUpdate } =
      schema.parse(args);

    const { gameId, user } = getSocketData(socket);

    const player = await playersServices.find(gameId, user.id);
    if (!player) {
      throw new Error(
        `Could not find player for gameId ${gameId} and userId ${user.id}`
      );
    }

    if (player.hasFinishedStep) {
      throw new Error(`Player has already finished the current step`);
    }

    const lastChosenPlayerActions = await computeLastChosenPlayerActions(
      gameId,
      user.id,
      stepId,
      playerActionsUpdate
    );

    if (!canUpdatePlayerActions(lastChosenPlayerActions, STEPS[stepId])) {
      socket.emit("actionPointsLimitExceeded");
      return;
    }

    const playerActions = await playerActionsServices.updatePlayerActions(
      user.id,
      lastChosenPlayerActions
    );

    const game = await gameServices.getDocument(gameId);

    socket.emit("playerActionsUpdated", {
      playerActions,
    });
    io.to(rooms.teachers(gameId)).emit("gameUpdated", { update: game });
  });
}

async function computeLastChosenPlayerActions(
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
