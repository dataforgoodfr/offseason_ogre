import express from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import {
  checkOwnershipFromRequest,
  guardResource,
} from "../../middlewares/guardResource";
import { controllers } from "./controllers";
import { limiter } from "../../middlewares/limit";

export { router };

const router = express.Router();

router.get("/", asyncErrorHandler(controllers.getManyControllers));
router.get(
  "/logged-user",
  asyncErrorHandler(controllers.getLoggedUserController)
);
router.get(
  "/sign-in",
  limiter,
  asyncErrorHandler(controllers.signInController)
);
router.get("/:id", asyncErrorHandler(controllers.getDocumentController));
router.get(
  "/:id/games/:gameId/team",
  asyncErrorHandler(controllers.getTeamForPlayer)
);

router.post("/sign-up", asyncErrorHandler(controllers.signUpController));
router.post(
  "/magic-link",
  asyncErrorHandler(controllers.sendMagicLinkController)
);

router.put(
  "/:id",
  guardResource({
    roles: ["admin"],
    ownership: checkOwnershipFromRequest("params", "id"),
  }),
  asyncErrorHandler(controllers.updateUser)
);
