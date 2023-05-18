import invariant from "tiny-invariant";
import { Server, Socket } from "../types";
import { services as gameServices } from "../../games/services";
import { services as playersServices } from "../../players/services";
import { services as teamsServices } from "../../teams/services";
import * as playerActionsServices from "../../actions/services/playerActions";
import * as teamActionsServices from "../../teamActions/services";
import { rooms } from "../constants";
import { getSocketData, wrapHandler } from "../utils";

export { handleResetGame };

function handleResetGame(io: Server, socket: Socket) {
  socket.on(
    "resetGame",
    wrapHandler(async (args: unknown) => {
      const { user, gameId } = getSocketData(socket);

      let game = await gameServices.getDocument(gameId);
      invariant(game, `Could not find game with id ${gameId}`);
      invariant(
        user.id === game.teacherId,
        `User ${user.id} is not a teacher of the game ${gameId}`
      );

      // Lock game to prevent players from performing actions.
      game = await gameServices.update(gameId, {
        status: "draft",
        step: 0,
        lastFinishedStep: 0,
      });

      io.to(rooms.game(gameId)).emit("gameUpdated", {
        update: game,
      });

      // Eject players from the game.
      io.to(rooms.game(gameId)).emit("gameReset", {});

      // Delete player actions and team actions.
      const [players, teams] = await Promise.all([
        playersServices.findMany({ gameId }),
        teamsServices.getMany({ gameId }),
      ]);

      await Promise.all(
        players.map((player) =>
          playerActionsServices.removeForPlayer({
            gameId,
            userId: player.userId,
          })
        )
      );
      await Promise.all(
        teams.map((team) =>
          teamActionsServices.removeForTeam({
            teamId: team.id,
          })
        )
      );
    })
  );
}
