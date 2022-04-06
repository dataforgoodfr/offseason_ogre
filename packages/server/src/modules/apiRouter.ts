import express from "express";
import { router as usersRouter } from "./users/routes";

export { apiRouter };

const apiRouter = express.Router();

apiRouter.use("/users", usersRouter);
