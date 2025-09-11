// Test setup file
import { jest } from '@jest/globals';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5432';
process.env.DB_USER = 'test';
process.env.DB_PASSWORD = 'test';
process.env.DB_NAME = 'test_db';
process.env.ENABLE_CLOUDINARY = 'false';
process.env.CLOUD_NAME = 'test-cloud';
process.env.API_KEY = 'test-api-key';
process.env.API_SECRET = 'test-api-secret';
process.env.APP_DOMAIN = 'http://localhost:3000';

// Global test utilities
global.mockRequest = (overrides = {}) => ({
  body: {},
  params: {},
  query: {},
  files: [],
  ...overrides
});

global.mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

global.mockNext = () => jest.fn();

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};
