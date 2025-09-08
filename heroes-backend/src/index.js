import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';
import { postgresConnection } from './db/db.js';
import { serverSetup } from './server.js';
import { createDirIfNotExist } from './utils/createDirIfNotExists.js';

await postgresConnection();
await createDirIfNotExist(TEMP_UPLOAD_DIR);
await createDirIfNotExist(UPLOAD_DIR);
serverSetup();
