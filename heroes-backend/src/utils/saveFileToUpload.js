import fs from 'fs/promises';
import { UPLOAD_DIR } from '../constants/index.js';
import path from 'path';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';
import { getEnvVar } from './getEnv.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `${getEnvVar('APP_DOMAIN')}/uploads/${file.filename}`;
};
