import express from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { controllers } from "./controllers";

export { router };

const router = express.Router();

router.get("/", asyncErrorHandler(controllers.getManyControllers));
router.get(
  "/logged-user",
  asyncErrorHandler(controllers.getLoggedUserController)
);
router.get("/sign-in", asyncErrorHandler(controllers.signInController));
router.get("/:id", asyncErrorHandler(controllers.getDocumentController));
router.get(
  "/:id/games/:gameId/team",
  asyncErrorHandler(controllers.getTeamForPlayer)
);

router.post("/logout", asyncErrorHandler(controllers.logoutController));
router.post("/sign-up", asyncErrorHandler(controllers.signUpController));
router.post(
  "/magic-link",
  asyncErrorHandler(controllers.sendMagicLinkController)
);

router.put("/:id", asyncErrorHandler(controllers.updateUser));
