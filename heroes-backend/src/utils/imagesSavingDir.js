import { getEnvVar } from './getEnv.js';
import { saveFileToCloudinary } from './saveFileToCloudinary.js';
import { saveFileToUploadDir } from './saveFileToUpload.js';

export const imagesSavingDir = async (image) => {
  let url;
  if (getEnvVar('ENABLE_CLOUDINARY') == true) {
    url = await saveFileToUploadDir(image);
  } else {
    url = await saveFileToCloudinary(image);
  }
  return url;
};
