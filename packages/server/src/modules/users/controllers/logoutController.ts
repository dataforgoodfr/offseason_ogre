import { Request, Response } from "express";

export { logoutController };

function logoutController(request: Request, response: Response) {
  response.clearCookie("authentificationToken", {
    sameSite: "none",
    secure: true,
  });
  response.status(200).send();
}
