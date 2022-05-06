import express from "express";
import { router as gamesRouter } from "./games/routes";
import { authenticateUser } from "./users/middlewares";
import { router as usersRouter } from "./users/routes";

export { apiRouter };

const apiRouter = express.Router();

apiRouter.use(authenticateUser);

apiRouter.use("/games", gamesRouter);
apiRouter.use("/users", usersRouter);
