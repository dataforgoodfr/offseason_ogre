import express from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { guardResource } from "../../middlewares/guardResource";
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

router.put(
  "/:id",
  guardResource({
    roles: ["admin"],
    ownership: {
      fromRequest: {
        source: "params",
        path: "id",
      },
    },
  }),
  asyncErrorHandler(controllers.updateUser)
);
