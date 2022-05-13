import { Request, Response } from "express";

export { logoutController };

function logoutController(request: Request, response: Response) {
  response.clearCookie("authentificationToken");
  response.status(200).send();
}
