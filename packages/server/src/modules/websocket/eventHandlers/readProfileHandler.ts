import invariant from "tiny-invariant";
import { Server, Socket } from "../types";
import { getSocketData, wrapHandler } from "../utils";
import { playerServices } from "../services";

export { handleReadProfile };

function handleReadProfile(io: Server, socket: Socket) {
  socket.on(
    "profile:read",
    wrapHandler(async () => {
      const { gameId, user } = getSocketData(socket);

      const player = await playerServices.findOne(gameId, user.id, {
        include: {
          profile: {
            include: {
              personalization: true,
            },
          },
        },
      });
      invariant(
        player?.profile,
        `Could not find player profile for user ${user.id} and game ${gameId}`
      );

      socket.emit("player:update", {
        updates: [player],
      });
    })
  );
}
