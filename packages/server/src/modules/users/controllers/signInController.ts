import type { Request, Response } from "express";
import invariant from "tiny-invariant";
import { sign, verify } from "../../tokens";

export { signInController };

function signInController(req: Request, res: Response): void {
  const { token } = req.params;
  if (!token) {
    res.status(401).end();
  }
  invariant(token, "Token not found");
  const payload = verify(token);
  invariant(
    typeof payload !== "string" && payload?.email,
    "Email not found in payload"
  );

  const authenticationToken = sign({
    payload: { email: payload.email, type: "authentication" },
    expiresIn: "30 days",
  });

  // set the cookie as the token string, with a similar max age as the token
  // here, the max age is in milliseconds, so we multiply by 1000
  res.cookie("authentificationToken", authenticationToken, {
    httpOnly: true,
    maxAge: 30 * 60 * 60 * 24 * 1000,
  });
  res.end();
}
