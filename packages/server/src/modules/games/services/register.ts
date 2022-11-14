import { database } from "../../../database";
import { logger } from "../../../logger";
import { NO_TEAM } from "../../teams/constants/teams";
import { createBusinessError } from "../../utils/businessError";
import { services as gameServices } from "./index";

export { register };

async function register({
  gameId,
  userId,
}: {
  gameId: number;
  userId: number;
}) {
  const game = await gameServices.getDocument(gameId);

  if (!game) {
    throw createBusinessError("GAME_NOT_FOUND", { id: gameId });
  }
  if (game.status === "playing" || game.status === "finished") {
    throw createBusinessError("GAME_ALREADY_STARTED");
  }

  const noTeam = await database.team.findUnique({
    where: { gameId_name: { gameId, name: NO_TEAM } },
    rejectOnNotFound: true,
  });

  try {
    await database.players.create({
      data: {
        gameId,
        userId,
        teamId: noTeam.id,
      },
    });
  } catch (err) {
    logger.error(err);
    throw createBusinessError("USER_ALREADY_JOINED_GAME", { userId, gameId });
  }
}
