import express from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { controllers } from "./controllers";

export { router };

const router = express.Router();

router.get("/", asyncErrorHandler(controllers.getManyControllers));
router.post("/", asyncErrorHandler(controllers.createController));
router.get("/:id", asyncErrorHandler(controllers.getGame));
