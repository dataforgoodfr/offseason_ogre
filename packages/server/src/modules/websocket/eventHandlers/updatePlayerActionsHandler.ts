import { Socket } from "socket.io";
import { z } from "zod";
import { database } from "../../../database";
import { services as usersServices } from "../../users/services";

export { handleUpdatePlayerActions };

function handleUpdatePlayerActions(socket: Socket) {
  socket.on("updatePlayerActions", async (args: unknown) => {
    const schema = z.object({
      update: z.object({
        playerActions: z
          .object({
            id: z.number(),
            isPerformed: z.boolean(),
          })
          .array(),
      }),
    });
    const {
      update: { playerActions },
    } = schema.parse(args);

    const authToken = getAuthTokenFromCookies(socket.handshake.headers.cookie);
    const user = await usersServices.authenticateUser(authToken);

    await Promise.all(
      playerActions.map((playerAction) =>
        database.playerActions.update({
          where: {
            id_userId: {
              id: playerAction.id,
              userId: user.id,
            },
          },
          data: {
            isPerformed: playerAction.isPerformed,
          },
        })
      )
    );
  });
}

function getAuthTokenFromCookies(cookies?: string) {
  try {
    return (
      cookies
        ?.split("; ")
        .find((row) => row.startsWith("authentificationToken="))
        ?.split("=")[1] || ""
    );
  } catch (err) {
    return "";
  }
}
