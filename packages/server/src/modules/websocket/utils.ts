/* eslint-disable no-param-reassign */
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { RoleName } from "@prisma/client";
import { safe } from "../../lib/fp";
import { setSessionItem, startSession } from "../../lib/session";
import { Game } from "../games/types";
import { Socket, SocketData } from "./types";

export { getSocketData, wrapHandler, hasFinishedStep, isGameFinished };

function getSocketData(socket: Socket): SocketData {
  return z
    .object({
      gameId: z.number(),
      user: z.object({
        id: z.number(),
        country: z.string(),
        email: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        roleId: z.number(),
      }),
      role: z.object({
        id: z.number(),
        name: z.string() as unknown as z.ZodEnum<[RoleName]>,
      }),
    })
    .parse(socket.data);
}

type SocketHandler = (...args: any[]) => Promise<any>;

function wrapHandler(...handlers: SocketHandler[]) {
  return setRequestId(runSafely(...handlers));
}

function runSafely(...handlers: SocketHandler[]) {
  return async (...args: any[]) => {
    await safe(
      async () => {
        // eslint-disable-next-line no-restricted-syntax
        for (const handler of handlers) {
          // eslint-disable-next-line no-await-in-loop
          await handler(...args);
        }
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

function isGameFinished(game: Pick<Game, "status">) {
  return game.status === "finished";
}
