import { database } from "../../../database";
import { logger } from "../../../logger";
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
  if (game.step > 0) {
    throw createBusinessError("GAME_ALREADY_STARTED");
  }

  const team1 = await database.team.findUnique({
    where: { gameId_name: { gameId, name: "Equipe 1" } },
    rejectOnNotFound: true,
  });
  const team2 = await database.team.findUnique({
    where: { gameId_name: { gameId, name: "Equipe 2" } },
    rejectOnNotFound: true,
  });

  try {
    await database.players.create({
      data: {
        gameId,
        userId,
        teamId: Math.random() > 0.5 ? team1.id : team2.id,
      },
    });
  } catch (err) {
    logger.error(err);
    throw createBusinessError("USER_ALREADY_JOINED_GAME", { userId, gameId });
  }
}
