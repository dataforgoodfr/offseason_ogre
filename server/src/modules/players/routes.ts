import express from 'express';
import { controllers } from './controllers';

export { router };

const router = express.Router();

router.get('/:id', controllers.getDocumentController);
