import express from "express";
import * as controllers from "./controllers";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";

export { router };

const router = express.Router();

router.get("/", asyncErrorHandler(controllers.getAllActionsController));
router.get(
  "/user",
  asyncErrorHandler(controllers.getOrCreatePlayerActionsController)
);
router.get(
  "/user/:userId",
  asyncErrorHandler(controllers.getOrCreatePlayerActionsController)
);
router.get("/:step", asyncErrorHandler(controllers.getActionsController));
