import fs from 'node:fs/promises';

export const createDirIfNotExist = async (dir) => {
  try {
    await fs.access(dir);
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(dir);
    }
  }
};
