/* eslint-disable no-param-reassign */
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { safe } from "../../lib/fp";
import { setSessionItem, startSession } from "../../lib/session";
import { Game } from "../games/types";
import { Socket, SocketData } from "./types";

export { getSocketData, wrapHandler, hasFinishedStep };

function getSocketData(socket: Socket): SocketData {
  const userSchema = z.object({
    id: z.number(),
    country: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    roleId: z.number(),
  });
  return z.object({ gameId: z.number(), user: userSchema }).parse(socket.data);
}

type SocketHandler = (...args: any[]) => Promise<any>;

function wrapHandler(handler: SocketHandler) {
  return setRequestId(runSafely(handler));
}

function runSafely(handler: SocketHandler) {
  return async (...args: any[]) => {
    await safe(
      async () => {
        await handler(...args);
      },
      { logError: true }
    );
  };
}

function setRequestId(handler: SocketHandler) {
  return async (...args: any[]) => {
    startSession(async () => {
      setSessionItem("requestId", uuidv4());
      await handler(...args);
    });
  };
}

function hasFinishedStep(game: Partial<Game>) {
  return game?.step === game?.lastFinishedStep;
}
