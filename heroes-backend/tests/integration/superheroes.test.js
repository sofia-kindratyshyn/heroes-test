import { jest } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { superHeroRouter } from '../../src/routers/superheroes.js';
import { pool } from '../../src/db/db.js';
import { imagesSavingDir } from '../../src/utils/imagesSavingDir.js';

// Mock the database
jest.mock('../../src/db/db.js', () => ({
  pool: {
    query: jest.fn()
  }
}));

// Mock image saving utility
jest.mock('../../src/utils/imagesSavingDir.js', () => ({
  imagesSavingDir: jest.fn()
}));

describe('Superheroes API Integration Tests', () => {
  let app;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    app.use('/', superHeroRouter);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /superhero', () => {
    it('should return paginated heroes list', async () => {
      const mockHeroes = [
        { id: 1, nickname: 'Superman', real_name: 'Clark Kent' },
        { id: 2, nickname: 'Batman', real_name: 'Bruce Wayne' }
      ];
      const mockCount = { rows: [{ count: '2' }] };

      pool.query
        .mockResolvedValueOnce({ rows: mockHeroes })
        .mockResolvedValueOnce(mockCount);

      const response = await request(app)
        .get('/superhero')
        .query({ page: 1, perPage: 5 })
        .expect(200);

      expect(response.body).toEqual({
        status: 200,
        message: 'Successfuly got Superheroes!',
        data: {
          heroes: mockHeroes,
          page: 1,
          perPage: 5,
          total: 2,
          totalPages: 1
        }
      });
    });

    it('should return heroes with search query', async () => {
      const mockHeroes = [{ id: 1, nickname: 'Superman', real_name: 'Clark Kent' }];
      const mockCount = { rows: [{ count: '1' }] };

      pool.query
        .mockResolvedValueOnce({ rows: mockHeroes })
        .mockResolvedValueOnce(mockCount);

      const response = await request(app)
        .get('/superhero')
        .query({ search: 'super' })
        .expect(200);

      expect(response.body.data.heroes).toEqual(mockHeroes);
    });

    it('should handle empty results', async () => {
      const mockCount = { rows: [{ count: '0' }] };

      pool.query
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce(mockCount);

      const response = await request(app)
        .get('/superhero')
        .expect(200);

      expect(response.body.data.heroes).toEqual([]);
      expect(response.body.data.total).toBe(0);
    });
  });

  describe('GET /superhero/:id', () => {
    it('should return hero by id', async () => {
      const mockHero = { id: 1, nickname: 'Superman', real_name: 'Clark Kent' };
      pool.query.mockResolvedValue({ rows: [mockHero] });

      const response = await request(app)
        .get('/superhero/1')
        .expect(200);

      expect(response.body).toEqual({
        status: 200,
        message: 'Got superhero with id: 1',
        data: mockHero
      });
    });

    it('should return 404 for non-existent hero', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .get('/superhero/999')
        .expect(404);

      expect(response.body.message).toContain('Suprhero not found');
    });
  });

  describe('POST /superhero', () => {
    it('should create new hero without images', async () => {
      const heroData = {
        nickname: 'Superman',
        real_name: 'Clark Kent',
        origin_description: 'From Krypton',
        superpowers: 'Flight, Super strength',
        catch_phrase: 'Up, up and away!'
      };
      const mockCreatedHero = { id: 1, ...heroData };
      pool.query.mockResolvedValue({ rows: [mockCreatedHero] });

      const response = await request(app)
        .post('/superhero')
        .send(heroData)
        .expect(201);

      expect(response.body).toEqual({
        status: 201,
        message: 'Successfuly created superhero!',
        data: mockCreatedHero
      });
    });

    it('should create new hero with images', async () => {
      const heroData = {
        nickname: 'Superman',
        real_name: 'Clark Kent',
        origin_description: 'From Krypton',
        superpowers: 'Flight, Super strength',
        catch_phrase: 'Up, up and away!'
      };
      const mockCreatedHero = { id: 1, ...heroData, images: ['https://example.com/image.jpg'] };
      pool.query.mockResolvedValue({ rows: [mockCreatedHero] });
      imagesSavingDir.mockResolvedValue('https://example.com/image.jpg');

      const response = await request(app)
        .post('/superhero')
        .field('nickname', heroData.nickname)
        .field('real_name', heroData.real_name)
        .field('origin_description', heroData.origin_description)
        .field('superpowers', heroData.superpowers)
        .field('catch_phrase', heroData.catch_phrase)
        .attach('images', Buffer.from('fake-image-data'), 'test.jpg')
        .expect(201);

      expect(response.body.data.images).toEqual(['https://example.com/image.jpg']);
    });

    it('should validate required fields', async () => {
      const invalidHeroData = {
        nickname: 'Superman'
        // missing required fields
      };

      const response = await request(app)
        .post('/superhero')
        .send(invalidHeroData)
        .expect(400);

      expect(response.body.message).toBe('Bad Request');
    });

    it('should validate field lengths', async () => {
      const invalidHeroData = {
        nickname: 'Su', // too short
        real_name: 'Clark Kent',
        origin_description: 'From Krypton',
        superpowers: 'Flight, Super strength',
        catch_phrase: 'Up, up and away!'
      };

      const response = await request(app)
        .post('/superhero')
        .send(invalidHeroData)
        .expect(400);

      expect(response.body.message).toBe('Bad Request');
    });
  });

  describe('PUT /superhero/:id', () => {
    it('should update hero successfully', async () => {
      const heroData = {
        nickname: 'Superman Updated',
        real_name: 'Clark Kent',
        origin_description: 'From Krypton',
        superpowers: 'Flight, Super strength',
        catch_phrase: 'Up, up and away!'
      };
      const existingImages = ['old-image.jpg'];
      const mockUpdatedHero = { id: 1, ...heroData };

      pool.query
        .mockResolvedValueOnce({ rows: [{ images: existingImages }] })
        .mockResolvedValueOnce({ rows: [mockUpdatedHero] });

      const response = await request(app)
        .put('/superhero/1')
        .send(heroData)
        .expect(200);

      expect(response.body).toEqual({
        status: 200,
        message: 'Successfuly updated Superhero!',
        data: mockUpdatedHero
      });
    });

    it('should update hero with new images', async () => {
      const heroData = {
        nickname: 'Superman Updated',
        real_name: 'Clark Kent',
        origin_description: 'From Krypton',
        superpowers: 'Flight, Super strength',
        catch_phrase: 'Up, up and away!'
      };
      const existingImages = ['old-image.jpg'];
      const mockUpdatedHero = { id: 1, ...heroData };
      imagesSavingDir.mockResolvedValue('https://example.com/new-image.jpg');

      pool.query
        .mockResolvedValueOnce({ rows: [{ images: existingImages }] })
        .mockResolvedValueOnce({ rows: [mockUpdatedHero] });

      const response = await request(app)
        .put('/superhero/1')
        .field('nickname', heroData.nickname)
        .field('real_name', heroData.real_name)
        .field('origin_description', heroData.origin_description)
        .field('superpowers', heroData.superpowers)
        .field('catch_phrase', heroData.catch_phrase)
        .attach('images', Buffer.from('fake-image-data'), 'new-image.jpg')
        .expect(200);

      expect(imagesSavingDir).toHaveBeenCalled();
    });
  });

  describe('DELETE /superhero/:id', () => {
    it('should delete hero successfully', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      const response = await request(app)
        .delete('/superhero/1')
        .expect(200);

      expect(response.body).toEqual({
        status: 204,
        message: 'Successfuly deleted hero with id : 1'
      });
    });
  });
});
