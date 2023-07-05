import { database } from "../../../database";
import { logger } from "../../../logger";
import { NO_TEAM } from "../../teams/constants/teams";
import { createBusinessError } from "../../utils/businessError";
import { services as gameServices } from "./index";

export { register };

async function register({
  gameCode,
  userId,
}: {
  gameCode: string;
  userId: number;
}): Promise<number> {
  const game = await gameServices.findOne({ code: gameCode });

  if (!game) {
    throw createBusinessError("GAME_NOT_FOUND", {
      prop: "code",
      value: gameCode,
    });
  }
  if (game.status === "playing" || game.status === "finished") {
    throw createBusinessError("GAME_ALREADY_STARTED");
  }

  const noTeam = await database.team.findUnique({
    where: { gameId_name: { gameId: game.id, name: NO_TEAM } },
    rejectOnNotFound: true,
  });

  try {
    await database.players.create({
      data: {
        gameId: game.id,
        userId,
        teamId: noTeam.id,
      },
    });

    return game.id;
  } catch (err) {
    logger.error(err);
    throw createBusinessError("USER_ALREADY_JOINED_GAME", {
      userId,
      gameId: game.id,
    });
  }
}
