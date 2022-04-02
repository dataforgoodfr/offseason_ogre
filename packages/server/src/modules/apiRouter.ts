import express from 'express';
import { router as playersRouter } from './players/routes';

export { apiRouter };

const apiRouter = express.Router();

apiRouter.use('/players', playersRouter);