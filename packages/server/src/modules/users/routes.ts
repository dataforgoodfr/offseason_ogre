import express from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { controllers } from "./controllers";

export { router };

const router = express.Router();

router.get(
  "/logged-user",
  asyncErrorHandler(controllers.getLoggedUserController)
);
router.get("/sign-in", asyncErrorHandler(controllers.signInController));
router.get("/:id", asyncErrorHandler(controllers.getDocumentController));
router.post("/", asyncErrorHandler(controllers.createController));
router.post(
  "/magic-link",
  asyncErrorHandler(controllers.sendMagicLinkController)
);
