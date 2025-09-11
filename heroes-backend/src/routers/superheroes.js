import { Router } from 'express';
import {
  deleteHeroController,
  getHeroByIdController,
  getHeroesController,
  postHeroController,
  putHeroController,
} from '../controllers/superheroes.js';
import {
  postHeroValidation,
  putHeroValidation,
} from '../utils/bodyValidationSchemas.js';
import { uploads } from '../middlewars/multer.js';
import { validateBody } from "../middlewars/validateBody.js";

export const superHeroRouter = Router();

superHeroRouter.get('/superhero/:id', getHeroByIdController);
superHeroRouter.get('/superhero', getHeroesController);
superHeroRouter.post(
  '/superhero',
  uploads.array('images'),
  validateBody(postHeroValidation),
  postHeroController,
);
superHeroRouter.delete('/superhero/:id', deleteHeroController);
superHeroRouter.put(
  '/superhero/:id',
  uploads.array('images'),
  validateBody(putHeroValidation),
  putHeroController,
);
