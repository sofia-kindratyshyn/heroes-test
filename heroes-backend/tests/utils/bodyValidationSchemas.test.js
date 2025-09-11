import { jest } from '@jest/globals';
import { postHeroValidation, putHeroValidation } from '../../src/utils/bodyValidationSchemas.js';

describe('Body Validation Schemas', () => {
  const validHeroData = {
    nickname: 'Superman',
    real_name: 'Clark Kent',
    origin_description: 'From Krypton',
    superpowers: 'Flight, Super strength',
    catch_phrase: 'Up, up and away!',
    images: ['https://example.com/image.jpg']
  };

  describe('postHeroValidation', () => {
    it('should validate correct hero data', () => {
      const { error } = postHeroValidation.validate(validHeroData);
      expect(error).toBeUndefined();
    });

    it('should validate hero data with numeric id', () => {
      const heroWithId = { ...validHeroData, id: 123 };
      const { error } = postHeroValidation.validate(heroWithId);
      expect(error).toBeUndefined();
    });

    it('should validate hero data without images', () => {
      const heroWithoutImages = { ...validHeroData };
      delete heroWithoutImages.images;
      const { error } = postHeroValidation.validate(heroWithoutImages);
      expect(error).toBeUndefined();
    });

    it('should fail validation for missing nickname', () => {
      const invalidData = { ...validHeroData };
      delete invalidData.nickname;
      const { error } = postHeroValidation.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['nickname']);
    });

    it('should fail validation for nickname too short', () => {
      const invalidData = { ...validHeroData, nickname: 'Su' };
      const { error } = postHeroValidation.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['nickname']);
      expect(error.details[0].message).toContain('at least 3 characters');
    });

    it('should fail validation for nickname too long', () => {
      const invalidData = { ...validHeroData, nickname: 'A'.repeat(51) };
      const { error } = postHeroValidation.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['nickname']);
      expect(error.details[0].message).toContain('less than or equal to 50');
    });

    it('should fail validation for missing real_name', () => {
      const invalidData = { ...validHeroData };
      delete invalidData.real_name;
      const { error } = postHeroValidation.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['real_name']);
    });

    it('should fail validation for real_name too short', () => {
      const invalidData = { ...validHeroData, real_name: 'A' };
      const { error } = postHeroValidation.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['real_name']);
      expect(error.details[0].message).toContain('at least 2 characters');
    });

    it('should fail validation for real_name too long', () => {
      const invalidData = { ...validHeroData, real_name: 'A'.repeat(101) };
      const { error } = postHeroValidation.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['real_name']);
      expect(error.details[0].message).toContain('less than or equal to 100');
    });

    it('should fail validation for missing origin_description', () => {
      const invalidData = { ...validHeroData };
      delete invalidData.origin_description;
      const { error } = postHeroValidation.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['origin_description']);
    });

    it('should fail validation for origin_description too short', () => {
      const invalidData = { ...validHeroData, origin_description: 'A' };
      const { error } = postHeroValidation.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['origin_description']);
      expect(error.details[0].message).toContain('at least 2 characters');
    });

    it('should fail validation for missing superpowers', () => {
      const invalidData = { ...validHeroData };
      delete invalidData.superpowers;
      const { error } = postHeroValidation.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['superpowers']);
    });

    it('should fail validation for missing catch_phrase', () => {
      const invalidData = { ...validHeroData };
      delete invalidData.catch_phrase;
      const { error } = postHeroValidation.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['catch_phrase']);
    });

    it('should fail validation for invalid image URLs', () => {
      const invalidData = { ...validHeroData, images: ['not-a-valid-url'] };
      const { error } = postHeroValidation.validate(invalidData);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['images', 0]);
      expect(error.details[0].message).toContain('must be a valid uri');
    });

    it('should validate multiple valid image URLs', () => {
      const validData = {
        ...validHeroData,
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.png',
          'https://example.com/image3.gif'
        ]
      };
      const { error } = postHeroValidation.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should convert string id to number', () => {
      const heroWithStringId = { ...validHeroData, id: '123' };
      const { value, error } = postHeroValidation.validate(heroWithStringId);
      expect(error).toBeUndefined();
      expect(value.id).toBe(123);
    });
  });

  describe('putHeroValidation', () => {
    it('should validate correct hero data', () => {
      const { error } = putHeroValidation.validate(validHeroData);
      expect(error).toBeUndefined();
    });

    it('should not allow id field in put validation', () => {
      const heroWithId = { ...validHeroData, id: 123 };
      const { error } = putHeroValidation.validate(heroWithId);
      expect(error).toBeDefined();
      expect(error.details[0].path).toEqual(['id']);
    });

    it('should have same validation rules as postHeroValidation for other fields', () => {
      // Test that all the same validation rules apply
      const testCases = [
        { field: 'nickname', value: 'Su', shouldFail: true },
        { field: 'nickname', value: 'Superman', shouldFail: false },
        { field: 'real_name', value: 'A', shouldFail: true },
        { field: 'real_name', value: 'Clark Kent', shouldFail: false },
        { field: 'origin_description', value: 'A', shouldFail: true },
        { field: 'origin_description', value: 'From Krypton', shouldFail: false }
      ];

      testCases.forEach(({ field, value, shouldFail }) => {
        const testData = { ...validHeroData, [field]: value };
        const { error } = putHeroValidation.validate(testData);
        
        if (shouldFail) {
          expect(error).toBeDefined();
          expect(error.details[0].path).toEqual([field]);
        } else {
          expect(error).toBeUndefined();
        }
      });
    });
  });
});
