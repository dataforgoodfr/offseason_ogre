import express from "express";
import { authenticateUser } from "../users/middlewares";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { controllers } from "./controllers";

export { router };

const router = express.Router();

router.post(
  "/",
  authenticateUser,
  asyncErrorHandler(controllers.createController)
);
