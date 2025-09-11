import { jest } from '@jest/globals';
import createHttpError from 'http-errors';

// Mock the database module
jest.mock('../../src/db/db.js', () => ({
  pool: {
    query: jest.fn()
  }
}));

import {
  getHeroes,
  getHeroById,
  deleteHero,
  postHero,
  updateHero
} from '../../src/services/superheroes.js';
import { pool } from '../../src/db/db.js';

describe('Superheroes Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getHeroes', () => {
    it('should return paginated heroes without search', async () => {
      const mockHeroes = [
        { id: 1, nickname: 'Superman', real_name: 'Clark Kent' },
        { id: 2, nickname: 'Batman', real_name: 'Bruce Wayne' }
      ];
      const mockCount = { rows: [{ count: '2' }] };

      pool.query
        .mockResolvedValueOnce({ rows: mockHeroes })
        .mockResolvedValueOnce(mockCount);

      const result = await getHeroes({ page: 1, perPage: 5 });

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1, 
        'SELECT * FROM heroes ORDER BY id LIMIT $1 OFFSET $2',
        [5, 0]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2, 
        'SELECT COUNT(*) FROM heroes'
      );
      expect(result).toEqual({
        heroes: mockHeroes,
        page: 1,
        perPage: 5,
        total: 2,
        totalPages: 1
      });
    });

    it('should return paginated heroes with search', async () => {
      const mockHeroes = [{ id: 1, nickname: 'Superman', real_name: 'Clark Kent' }];
      const mockCount = { rows: [{ count: '1' }] };

      pool.query
        .mockResolvedValueOnce({ rows: mockHeroes })
        .mockResolvedValueOnce(mockCount);

      const result = await getHeroes({ page: 1, perPage: 5, search: 'super' });

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1,
        'SELECT * FROM heroes WHERE nickname ILIKE $1 ORDER BY id LIMIT $2 OFFSET $3',
        ['%super%', 5, 0]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2,
        'SELECT COUNT(*) FROM heroes WHERE nickname ILIKE $1',
        ['%super%']
      );
      expect(result.heroes).toEqual(mockHeroes);
    });

    it('should handle default pagination parameters', async () => {
      const mockHeroes = [];
      const mockCount = { rows: [{ count: '0' }] };

      pool.query
        .mockResolvedValueOnce({ rows: mockHeroes })
        .mockResolvedValueOnce(mockCount);

      await getHeroes({});

      expect(pool.query).toHaveBeenNthCalledWith(1,
        'SELECT * FROM heroes ORDER BY id LIMIT $1 OFFSET $2',
        [5, 0]
      );
    });

    it('should calculate correct offset for different pages', async () => {
      const mockHeroes = [];
      const mockCount = { rows: [{ count: '0' }] };

      pool.query
        .mockResolvedValueOnce({ rows: mockHeroes })
        .mockResolvedValueOnce(mockCount);

      await getHeroes({ page: 3, perPage: 10 });

      expect(pool.query).toHaveBeenNthCalledWith(1,
        'SELECT * FROM heroes ORDER BY id LIMIT $1 OFFSET $2',
        [10, 20]
      );
    });
  });

  describe('getHeroById', () => {
    it('should return hero when found', async () => {
      const mockHero = { id: 1, nickname: 'Superman', real_name: 'Clark Kent' };
      pool.query.mockResolvedValue({ rows: [mockHero] });

      const result = await getHeroById(1);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM heroes WHERE id = $1', [1]);
      expect(result).toEqual(mockHero);
    });

    it('should return 404 error when hero not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      const result = await getHeroById(999);

      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM heroes WHERE id = $1', [999]);
      expect(result).toBeInstanceOf(Error);
      expect(result.status).toBe(404);
      expect(result.message).toBe('Suprhero not found');
    });
  });

  describe('deleteHero', () => {
    it('should delete hero successfully', async () => {
      pool.query.mockResolvedValue({ rowCount: 1 });

      await deleteHero(1);

      expect(pool.query).toHaveBeenCalledWith('DELETE FROM heroes WHERE id = $1', [1]);
    });
  });

  describe('postHero', () => {
    it('should create new hero successfully', async () => {
      const payload = {
        nickname: 'Superman',
        real_name: 'Clark Kent',
        origin_description: 'From Krypton',
        superpowers: 'Flight, Super strength',
        catch_phrase: 'Up, up and away!',
        images: ['image1.jpg', 'image2.jpg']
      };
      const mockCreatedHero = { id: 1, ...payload };
      pool.query.mockResolvedValue({ rows: [mockCreatedHero] });

      const result = await postHero(payload);

      expect(pool.query).toHaveBeenCalledWith(
        `INSERT INTO heroes
      (nickname, real_name, origin_description, superpowers, catch_phrase, images)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
        [
          payload.nickname,
          payload.real_name,
          payload.origin_description,
          payload.superpowers,
          payload.catch_phrase,
          payload.images
        ]
      );
      expect(result).toEqual(mockCreatedHero);
    });
  });

  describe('updateHero', () => {
    it('should update hero successfully', async () => {
      const payload = {
        nickname: 'Superman Updated',
        real_name: 'Clark Kent',
        origin_description: 'From Krypton',
        superpowers: 'Flight, Super strength',
        catch_phrase: 'Up, up and away!',
        images: ['new_image.jpg']
      };
      const existingImages = ['old_image.jpg'];
      const mockUpdatedHero = { id: 1, ...payload };
      
      pool.query
        .mockResolvedValueOnce({ rows: [{ images: existingImages }] })
        .mockResolvedValueOnce({ rows: [mockUpdatedHero] });

      const result = await updateHero(payload, 1);

      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1, 'SELECT images FROM heroes WHERE id = $1', [1]);
      expect(pool.query).toHaveBeenNthCalledWith(2,
        `UPDATE heroes
     SET nickname=$1, real_name=$2, origin_description=$3, superpowers=$4, catch_phrase=$5, images=$6
     WHERE id=$7
     RETURNING *`,
        [
          payload.nickname,
          payload.real_name,
          payload.origin_description,
          payload.superpowers,
          payload.catch_phrase,
          ['old_image.jpg', 'new_image.jpg'], // Combined images array
          1
        ]
      );
      expect(result).toEqual(mockUpdatedHero);
    });
  });
});
