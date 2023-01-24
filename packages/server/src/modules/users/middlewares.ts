import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { database } from "../../database";
import { verify } from "../tokens";

export { authenticateUser };

async function authenticateUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const { authentificationToken } = request.cookies;
  let email: string | undefined;
  try {
    const payload = verify(authentificationToken);
    const payloadSchema = z.object({
      email: z.string(),
    });
    email = payloadSchema.parse(payload).email;
  } catch (err) {
    /* Token not valid */
  }
  if (typeof email === "undefined") {
    next();
    return;
  }
  database.user
    .findUnique({
      where: { email },
      include: {
        role: true,
      },
    })
    .then((user) => {
      response.locals.user = user;
      next();
    })
    .catch(next);
}
