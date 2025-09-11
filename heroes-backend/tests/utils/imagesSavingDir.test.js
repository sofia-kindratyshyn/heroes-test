import { jest } from '@jest/globals';
import { imagesSavingDir } from '../../src/utils/imagesSavingDir.js';
import { saveFileToCloudinary } from '../../src/utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../../src/utils/saveFileToUpload.js';
import { getEnvVar } from '../../src/utils/getEnv.js';

// Mock the utility functions
jest.mock('../../src/utils/saveFileToCloudinary.js', () => ({
  saveFileToCloudinary: jest.fn()
}));

jest.mock('../../src/utils/saveFileToUpload.js', () => ({
  saveFileToUploadDir: jest.fn()
}));

jest.mock('../../src/utils/getEnv.js', () => ({
  getEnvVar: jest.fn()
}));

describe('imagesSavingDir Utility', () => {
  const mockFile = {
    filename: 'test-image.jpg',
    path: '/tmp/test-image.jpg',
    mimetype: 'image/jpeg'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use Cloudinary when ENABLE_CLOUDINARY is true', async () => {
    const mockUrl = 'https://cloudinary.com/test-image.jpg';
    getEnvVar.mockReturnValue(true);
    saveFileToUploadDir.mockResolvedValue(mockUrl);

    const result = await imagesSavingDir(mockFile);

    expect(getEnvVar).toHaveBeenCalledWith('ENABLE_CLOUDINARY');
    expect(saveFileToUploadDir).toHaveBeenCalledWith(mockFile);
    expect(saveFileToCloudinary).not.toHaveBeenCalled();
    expect(result).toBe(mockUrl);
  });

  it('should use local upload when ENABLE_CLOUDINARY is false', async () => {
    const mockUrl = '/uploads/test-image.jpg';
    getEnvVar.mockReturnValue(false);
    saveFileToCloudinary.mockResolvedValue(mockUrl);

    const result = await imagesSavingDir(mockFile);

    expect(getEnvVar).toHaveBeenCalledWith('ENABLE_CLOUDINARY');
    expect(saveFileToCloudinary).toHaveBeenCalledWith(mockFile);
    expect(saveFileToUploadDir).not.toHaveBeenCalled();
    expect(result).toBe(mockUrl);
  });

  it('should use local upload when ENABLE_CLOUDINARY is undefined', async () => {
    const mockUrl = '/uploads/test-image.jpg';
    getEnvVar.mockReturnValue(undefined);
    saveFileToCloudinary.mockResolvedValue(mockUrl);

    const result = await imagesSavingDir(mockFile);

    expect(getEnvVar).toHaveBeenCalledWith('ENABLE_CLOUDINARY');
    expect(saveFileToCloudinary).toHaveBeenCalledWith(mockFile);
    expect(saveFileToUploadDir).not.toHaveBeenCalled();
    expect(result).toBe(mockUrl);
  });

  it('should handle Cloudinary errors', async () => {
    const mockError = new Error('Cloudinary upload failed');
    getEnvVar.mockReturnValue(true);
    saveFileToUploadDir.mockRejectedValue(mockError);

    await expect(imagesSavingDir(mockFile)).rejects.toThrow('Cloudinary upload failed');
    expect(saveFileToUploadDir).toHaveBeenCalledWith(mockFile);
    expect(saveFileToCloudinary).not.toHaveBeenCalled();
  });

  it('should handle local upload errors', async () => {
    const mockError = new Error('Local upload failed');
    getEnvVar.mockReturnValue(false);
    saveFileToCloudinary.mockRejectedValue(mockError);

    await expect(imagesSavingDir(mockFile)).rejects.toThrow('Local upload failed');
    expect(saveFileToCloudinary).toHaveBeenCalledWith(mockFile);
    expect(saveFileToUploadDir).not.toHaveBeenCalled();
  });

  it('should handle different file types', async () => {
    const testCases = [
      { filename: 'test.jpg', mimetype: 'image/jpeg' },
      { filename: 'test.png', mimetype: 'image/png' },
      { filename: 'test.gif', mimetype: 'image/gif' },
      { filename: 'test.webp', mimetype: 'image/webp' }
    ];

    getEnvVar.mockReturnValue(false);
    saveFileToCloudinary.mockResolvedValue('/uploads/test.jpg');

    for (const testFile of testCases) {
      await imagesSavingDir(testFile);
      expect(saveFileToCloudinary).toHaveBeenCalledWith(testFile);
    }
  });
});
