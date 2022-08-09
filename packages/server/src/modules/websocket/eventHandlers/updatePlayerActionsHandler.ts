import cookie from "cookie";
import { Socket } from "socket.io";
import { z } from "zod";
import { services as usersServices } from "../../users/services";
import * as playerActionsServices from "../../actions/services/playerActions";

export { updatePlayerActions };

function updatePlayerActions(socket: Socket) {
  socket.on("updatePlayerActions", async (args: unknown) => {
    const schema = z.object({
      playerActions: z
        .object({
          id: z.number(),
          isPerformed: z.boolean(),
        })
        .array()
        .min(1),
    });

    const { playerActions } = schema.parse(args);

    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const user = await usersServices.authenticateUser(
      cookies?.authentificationToken
    );

    const updatedPlayerActions =
      await playerActionsServices.updatePlayerActions(user.id, playerActions);

    socket.emit("playerActionsUpdated", {
      playerActions: updatedPlayerActions,
    });
  });
}
