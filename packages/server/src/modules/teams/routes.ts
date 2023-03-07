import express from "express";
import * as controllers from "./controllers";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { guardResource } from "../../middlewares/guardResource";
import { services } from "../games/services";

export { router };

const router = express.Router();

router.get("/", asyncErrorHandler(controllers.getTeamsController));
router.get("/:teamId", asyncErrorHandler(controllers.getTeamController));
router.post(
  "/",
  guardResource({
    roles: ["admin"],
    ownership: async (user, request) => {
      const gameId = parseInt(request.body.gameId, 10);
      const game = await services.getDocument(gameId);

      return {
        success: user.id === game?.teacherId,
      };
    },
  }),
  asyncErrorHandler(controllers.createTeamsController)
);
