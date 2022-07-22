import express from "express";
import * as controllers from "./controllers";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";

export { router };

const router = express.Router();

router.get("/", asyncErrorHandler(controllers.getAllActionsController));
router.get(
  "/me",
  asyncErrorHandler(controllers.getOrCreatePlayerActionsController)
);
router.put("/me", asyncErrorHandler(controllers.updatePlayerActionsController));
router.get("/:step", asyncErrorHandler(controllers.getActionsController));
