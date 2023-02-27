import express from "express";
import { guardResource } from "../../middlewares/guardResource";
import { services as teamServices } from "../teams/services";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { controllers } from "./controllers";
import { services as gameServices } from "./services";

export { router };

const router = express.Router();

router.get("/", asyncErrorHandler(controllers.getManyControllers));
router.get(
  "/played-games",
  asyncErrorHandler(controllers.getPlayedGamesController)
);
router.get("/:id", asyncErrorHandler(controllers.getGame));
router.get(
  "/:id/validate",
  asyncErrorHandler(controllers.validateProfilesController)
);
router.post(
  "/:id/forms/update",
  asyncErrorHandler(controllers.updateProfilesController)
);
router.get("/:id/players", asyncErrorHandler(controllers.getPlayersController));
router.put(
  "/:id/players/order",
  guardResource({
    roles: ["admin"],
    ownership: async (user, request) => {
      const gameId = parseInt(request.body.gameId, 10);
      const game = await gameServices.getDocument(gameId);

      return {
        success: user.id === game?.teacherId,
      };
    },
  }),
  asyncErrorHandler(controllers.putPlayersInTeamsController)
);
router.post("/", asyncErrorHandler(controllers.createController));
router.post("/register", asyncErrorHandler(controllers.registerController));
router.post(
  "/remove-player",
  asyncErrorHandler(controllers.removePlayerController)
);
router.put("/change-team", asyncErrorHandler(controllers.changeTeamController));
router.post(
  "/remove-team",
  guardResource({
    roles: ["admin"],
    ownership: async (user, request) => {
      const teamId = parseInt(request.body.teamId, 10);
      const team = await teamServices.get(teamId, { include: { game: true } });

      return {
        success: user.id === team?.game?.teacherId,
      };
    },
  }),
  asyncErrorHandler(controllers.removeTeamController)
);
router.put("/:id", asyncErrorHandler(controllers.updateGame));
