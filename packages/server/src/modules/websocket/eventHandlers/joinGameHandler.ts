import { Socket } from "socket.io";
import { z } from "zod";
import { services as gameServices } from "../../games/services";

export { handleJoinGame };

function handleJoinGame(socket: Socket) {
  socket.on("joinGame", async (rawGameId: unknown) => {
    const gameId = z.number().parse(rawGameId);
    socket.join(`${gameId}`);
    const gameState = await gameServices.initState({ gameId });
    socket.emit("resetGameState", gameState);
  });
}
