import * as jwt from "jsonwebtoken";
import type { Request, Response } from "express";
import invariant from "tiny-invariant";
import { z } from "zod";
import { sign, verify } from "../../tokens";

export { signInController };

function signInController(req: Request, res: Response): void {
  const querySchema = z.object({
    token: z.string(),
  });

  const { token } = querySchema.parse(req.query);
  if (!token) {
    res.status(401).end();
    return;
  }
  let payload;
  try {
    payload = verify(token);
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      // if the error thrown is because the JWT is unauthorized, return a 401 error
      res.status(401).send("Invalid link.");
      return;
    }
    // otherwise, return a bad request error
    res.status(400).send("Unkown error during sign-in.");
    return;
  }

  invariant(
    typeof payload !== "string" && payload?.email,
    "Email not found in payload"
  );
  const authenticationToken = sign({
    payload: { email: payload.email, type: "authentication" },
    expiresIn: "30 days",
  });

  res.send({
    token: authenticationToken,
  });
}
