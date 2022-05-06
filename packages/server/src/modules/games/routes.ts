import express from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { controllers } from "./controllers";

export { router };

const router = express.Router();

router.post("/", asyncErrorHandler(controllers.createController));
