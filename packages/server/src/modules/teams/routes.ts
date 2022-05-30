import express from "express";
import * as controllers from "./controllers";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";

export { router };

const router = express.Router();

router.get("/", asyncErrorHandler(controllers.getTeamsController));
router.get("/:teamId", asyncErrorHandler(controllers.getTeamController));
