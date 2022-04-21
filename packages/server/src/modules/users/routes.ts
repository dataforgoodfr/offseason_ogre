import express from "express";
import { asyncErrorHandler } from "../utils/asyncErrorHandler";
import { controllers } from "./controllers";

export { router };

const router = express.Router();

router.get("/:id", asyncErrorHandler(controllers.getDocumentController));
router.get("/", asyncErrorHandler(controllers.getAllDocumentsController));
router.post("/login", asyncErrorHandler(controllers.getUser));
