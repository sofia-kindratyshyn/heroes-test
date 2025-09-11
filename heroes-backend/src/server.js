import express from 'express';
import cors from 'cors';
import { notFoundErr } from './middlewars/notFoundError.js';
import { getEnvVar } from './utils/getEnv.js';
import { superHeroRouter } from './routers/superheroes.js';
import { UPLOAD_DIR } from './constants/index.js';
import { errorHandler } from './middlewars/errorsHandler.js';

const PORT = Number(getEnvVar('PORT'));

export const serverSetup = async () => {
  const app = express();

  app.use(express.json());

  app.use(cors({
  origin: ["https://heroes-test-1.onrender.com", "http://localhost:3000"],
 }));


  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(superHeroRouter);

  app.use(notFoundErr);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
