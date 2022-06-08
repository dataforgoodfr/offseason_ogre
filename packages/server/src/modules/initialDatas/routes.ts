import express from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { controllers } from "./controllers";

const router = express.Router();

router.get("/initialdata", asyncErrorHandler(controllers.getManyDatas));

export { router };
