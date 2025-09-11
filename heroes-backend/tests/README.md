# Heroes Backend Tests

This directory contains comprehensive unit tests for the Heroes Backend API.

## Test Structure

```
tests/
├── setup.js                           # Test configuration and utilities
├── services/
│   └── superheroes.test.js            # Service layer tests
├── controllers/
│   └── superheroes.test.js            # Controller layer tests
├── middleware/
│   ├── validateBody.test.js          # Validation middleware tests
│   └── errorsHandler.test.js          # Error handling tests
├── utils/
│   ├── bodyValidationSchemas.test.js  # Validation schema tests
│   └── imagesSavingDir.test.js        # Image utility tests
├── integration/
│   └── superheroes.test.js            # API integration tests
└── README.md                          # This file
```

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Specific Test Files
```bash
# Run only service tests
npm test -- tests/services/

# Run only controller tests
npm test -- tests/controllers/

# Run only integration tests
npm test -- tests/integration/
```

## Test Coverage

The tests cover:

### Services (`services/superheroes.test.js`)
- ✅ `getHeroes()` - Pagination, search, default parameters
- ✅ `getHeroById()` - Success and 404 cases
- ✅ `deleteHero()` - Successful deletion
- ✅ `postHero()` - Hero creation
- ✅ `updateHero()` - Hero updates with image handling

### Controllers (`controllers/superheroes.test.js`)
- ✅ `getHeroByIdController()` - Success and error handling
- ✅ `postHeroController()` - With and without images
- ✅ `deleteHeroController()` - Successful deletion
- ✅ `putHeroController()` - Updates with and without images
- ✅ `getHeroesController()` - Pagination and search

### Middleware (`middleware/`)
- ✅ `validateBody()` - Validation success and failure cases
- ✅ `validateQuery()` - Query parameter validation
- ✅ `errorHandler()` - HTTP and generic error handling

### Utils (`utils/`)
- ✅ `bodyValidationSchemas` - Joi schema validation
- ✅ `imagesSavingDir()` - Image saving logic

### Integration (`integration/superheroes.test.js`)
- ✅ GET `/superhero` - Pagination and search
- ✅ GET `/superhero/:id` - Success and 404
- ✅ POST `/superhero` - Creation with validation
- ✅ PUT `/superhero/:id` - Updates
- ✅ DELETE `/superhero/:id` - Deletion

## Mocking Strategy

The tests use Jest's mocking capabilities to:

- **Database**: Mock PostgreSQL queries without requiring a real database
- **File Upload**: Mock image processing utilities
- **Environment**: Mock environment variables for testing
- **External Services**: Mock Cloudinary and local file operations

## Test Utilities

### Global Test Helpers
- `mockRequest()` - Creates mock Express request objects
- `mockResponse()` - Creates mock Express response objects
- `mockNext()` - Creates mock Express next function

### Example Usage
```javascript
const mockReq = global.mockRequest({
  body: { nickname: 'Superman' },
  params: { id: '1' }
});
const mockRes = global.mockResponse();
const mockNext = global.mockNext();
```

## Writing New Tests

### Service Tests
```javascript
describe('Service Function', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle success case', async () => {
    // Arrange
    mockQuery.mockResolvedValue({ rows: [mockData] });
    
    // Act
    const result = await serviceFunction(params);
    
    // Assert
    expect(result).toEqual(expectedResult);
    expect(mockQuery).toHaveBeenCalledWith(expectedQuery, expectedParams);
  });
});
```

### Controller Tests
```javascript
describe('Controller Function', () => {
  it('should return correct response', async () => {
    // Arrange
    const mockReq = global.mockRequest({ params: { id: '1' } });
    const mockRes = global.mockResponse();
    mockService.mockResolvedValue(mockData);
    
    // Act
    await controllerFunction(mockReq, mockRes);
    
    // Assert
    expect(mockRes.json).toHaveBeenCalledWith({
      status: 200,
      message: 'Success message',
      data: mockData
    });
  });
});
```

## Best Practices

1. **Isolation**: Each test should be independent
2. **Mocking**: Mock external dependencies (DB, file system, APIs)
3. **Coverage**: Aim for high test coverage (>90%)
4. **Naming**: Use descriptive test names
5. **Arrange-Act-Assert**: Structure tests clearly
6. **Cleanup**: Clear mocks between tests

## Debugging Tests

### Run Single Test
```bash
npm test -- --testNamePattern="specific test name"
```

### Debug Mode
```bash
npm test -- --detectOpenHandles --forceExit
```

### Verbose Output
```bash
npm test -- --verbose
```
