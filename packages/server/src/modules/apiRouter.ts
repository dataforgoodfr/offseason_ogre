import express from "express";
import { router as gamesRouter } from "./games/routes";
import { authenticateUser } from "./users/middlewares";
import { router as teamRouter } from "./teams/routes";
import { router as usersRouter } from "./users/routes";
import { router as actionsRouter } from "./actions/routes";
import { router as rolesRouter } from "./roles/routes";

export { apiRouter };

const apiRouter = express.Router();

apiRouter.use(authenticateUser);

apiRouter.use("/games", gamesRouter);
apiRouter.use("/teams", teamRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/actions", actionsRouter);
apiRouter.use("/roles", rolesRouter);
