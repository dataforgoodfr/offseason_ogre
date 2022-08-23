import cookie from "cookie";
import { Socket } from "socket.io";
import { z } from "zod";
import { services as gameServices } from "../../games/services";
import { services as usersServices } from "../../users/services";
import * as playerActionsServices from "../../actions/services/playerActions";

export { handleJoinGame };

function handleJoinGame(socket: Socket) {
  socket.on("joinGame", async (rawGameId: unknown) => {
    const gameId = z.number().parse(rawGameId);
    socket.join(`${gameId}`);
    const gameState = await gameServices.initState({ gameId });
    socket.emit("resetGameState", gameState);

    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const user = await usersServices.authenticateUser(
      cookies?.authentificationToken
    );
    const game = await gameServices.getDocument(gameId);
    if (game?.teacherId !== user.id) {
      const playerActions =
        await playerActionsServices.getOrCreatePlayerActions(gameId, user.id);
      socket.emit("playerActionsUpdated", { playerActions });
    }
  });
}
