import { z } from "zod";
import invariant from "tiny-invariant";
import { Server, Socket } from "../types";
import { services as playersServices } from "../../players/services";
import { services as profileServices } from "../../profiles/services";
import { wrapHandler } from "../utils";

export { handleReadProfile };

function handleReadProfile(io: Server, socket: Socket) {
  socket.on(
    "readProfile",
    wrapHandler(async (args: unknown) => {
      const schema = z.object({
        gameId: z.number(),
        userId: z.number(),
      });

      const { gameId, userId } = schema.parse(args);

      const player = await playersServices.find(gameId, userId);

      invariant(
        player?.profileId,
        `Could not find player for user ${userId} and game ${gameId}`
      );

      const profile = await profileServices.find(player.profileId);

      socket.emit("profileUpdated", {
        update: profile,
      });
    })
  );
}
