import express from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { controllers } from "./controllers";

export { router };

const router = express.Router();

router.get("/", asyncErrorHandler(controllers.getManyControllers));
router.get(
  "/played-games",
  asyncErrorHandler(controllers.getPlayedGamesController)
);
router.get("/:id", asyncErrorHandler(controllers.getGame));
router.get("/:id/players", asyncErrorHandler(controllers.getPlayersController));
router.post("/", asyncErrorHandler(controllers.createController));
router.post("/register", asyncErrorHandler(controllers.registerController));
router.post(
  "/remove-player",
  asyncErrorHandler(controllers.removePlayerController)
);
router.put("/change-team", asyncErrorHandler(controllers.changeTeamController));
router.put("/:id", asyncErrorHandler(controllers.updateGame));
router.put("/:id/step/next", asyncErrorHandler(controllers.incrementGameStep));
