import { jest } from '@jest/globals';
import {
  getHeroByIdController,
  postHeroController,
  deleteHeroController,
  putHeroController,
  getHeroesController
} from '../../src/controllers/superheroes.js';
import * as superheroesService from '../../src/services/superheroes.js';
import { imagesSavingDir } from '../../src/utils/imagesSavingDir.js';

// Mock the services
jest.mock('../../src/services/superheroes.js', () => ({
  getHeroById: jest.fn(),
  postHero: jest.fn(),
  deleteHero: jest.fn(),
  updateHero: jest.fn(),
  getHeroes: jest.fn()
}));

jest.mock('../../src/utils/imagesSavingDir.js', () => ({
  imagesSavingDir: jest.fn()
}));

describe('Superheroes Controllers', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    jest.clearAllMocks();
    mockReq = global.mockRequest();
    mockRes = global.mockResponse();
  });

  describe('getHeroByIdController', () => {
    it('should return hero data successfully', async () => {
      const mockHero = { id: 1, nickname: 'Superman', real_name: 'Clark Kent' };
      superheroesService.getHeroById.mockResolvedValue(mockHero);
      mockReq.params = { id: '1' };

      await getHeroByIdController(mockReq, mockRes);

      expect(superheroesService.getHeroById).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Got superhero with id: 1',
        data: mockHero
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Hero not found');
      error.status = 404;
      superheroesService.getHeroById.mockRejectedValue(error);
      mockReq.params = { id: '999' };

      await expect(getHeroByIdController(mockReq, mockRes)).rejects.toThrow('Hero not found');
    });
  });

  describe('postHeroController', () => {
    it('should create hero without images', async () => {
      const payload = {
        nickname: 'Superman',
        real_name: 'Clark Kent',
        origin_description: 'From Krypton',
        superpowers: 'Flight, Super strength',
        catch_phrase: 'Up, up and away!'
      };
      const mockCreatedHero = { id: 1, ...payload };
      
      mockReq.body = payload;
      mockReq.files = [];
      superheroesService.postHero.mockResolvedValue(mockCreatedHero);

      await postHeroController(mockReq, mockRes);

      expect(superheroesService.postHero).toHaveBeenCalledWith(payload);
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Successfuly created superhero!',
        data: mockCreatedHero
      });
    });

    it('should create hero with images', async () => {
      const payload = {
        nickname: 'Superman',
        real_name: 'Clark Kent',
        origin_description: 'From Krypton',
        superpowers: 'Flight, Super strength',
        catch_phrase: 'Up, up and away!'
      };
      const mockFiles = [
        { filename: 'image1.jpg', path: '/tmp/image1.jpg' },
        { filename: 'image2.jpg', path: '/tmp/image2.jpg' }
      ];
      const mockUrls = ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'];
      const mockCreatedHero = { id: 1, ...payload, images: mockUrls };
      
      mockReq.body = payload;
      mockReq.files = mockFiles;
      imagesSavingDir
        .mockResolvedValueOnce(mockUrls[0])
        .mockResolvedValueOnce(mockUrls[1]);
      superheroesService.postHero.mockResolvedValue(mockCreatedHero);

      await postHeroController(mockReq, mockRes);

      expect(imagesSavingDir).toHaveBeenCalledTimes(2);
      expect(imagesSavingDir).toHaveBeenCalledWith(mockFiles[0]);
      expect(imagesSavingDir).toHaveBeenCalledWith(mockFiles[1]);
      expect(superheroesService.postHero).toHaveBeenCalledWith({
        ...payload,
        images: mockUrls
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 201,
        message: 'Successfuly created superhero!',
        data: mockCreatedHero
      });
    });
  });

  describe('deleteHeroController', () => {
    it('should delete hero successfully', async () => {
      mockReq.params = { id: '1' };
      superheroesService.deleteHero.mockResolvedValue();

      await deleteHeroController(mockReq, mockRes);

      expect(superheroesService.deleteHero).toHaveBeenCalledWith('1');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 204,
        message: 'Successfuly deleted hero with id : 1'
      });
    });
  });

  describe('putHeroController', () => {
    it('should update hero without new images', async () => {
      const payload = {
        nickname: 'Superman Updated',
        real_name: 'Clark Kent',
        origin_description: 'From Krypton',
        superpowers: 'Flight, Super strength',
        catch_phrase: 'Up, up and away!'
      };
      const mockUpdatedHero = { id: 1, ...payload };
      
      mockReq.params = { id: '1' };
      mockReq.body = payload;
      mockReq.files = [];
      superheroesService.updateHero.mockResolvedValue(mockUpdatedHero);

      await putHeroController(mockReq, mockRes);

      expect(superheroesService.updateHero).toHaveBeenCalledWith(payload, '1');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Successfuly updated Superhero!',
        data: mockUpdatedHero
      });
    });

    it('should update hero with new images', async () => {
      const payload = {
        nickname: 'Superman Updated',
        real_name: 'Clark Kent',
        origin_description: 'From Krypton',
        superpowers: 'Flight, Super strength',
        catch_phrase: 'Up, up and away!'
      };
      const mockFiles = [
        { filename: 'new_image1.jpg', path: '/tmp/new_image1.jpg' }
      ];
      const mockUrls = ['https://example.com/new_image1.jpg'];
      const mockUpdatedHero = { id: 1, ...payload, images: mockUrls };
      
      mockReq.params = { id: '1' };
      mockReq.body = payload;
      mockReq.files = mockFiles;
      imagesSavingDir.mockResolvedValue(mockUrls[0]);
      superheroesService.updateHero.mockResolvedValue(mockUpdatedHero);

      await putHeroController(mockReq, mockRes);

      expect(imagesSavingDir).toHaveBeenCalledWith(mockFiles[0]);
      expect(superheroesService.updateHero).toHaveBeenCalledWith({
        ...payload,
        images: mockUrls
      }, '1');
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Successfuly updated Superhero!',
        data: mockUpdatedHero
      });
    });
  });

  describe('getHeroesController', () => {
    it('should return heroes list successfully', async () => {
      const mockResult = {
        heroes: [
          { id: 1, nickname: 'Superman', real_name: 'Clark Kent' },
          { id: 2, nickname: 'Batman', real_name: 'Bruce Wayne' }
        ],
        page: 1,
        perPage: 5,
        total: 2,
        totalPages: 1
      };
      
      mockReq.query = { page: '1', perPage: '5', search: 'super' };
      superheroesService.getHeroes.mockResolvedValue(mockResult);

      await getHeroesController(mockReq, mockRes);

      expect(superheroesService.getHeroes).toHaveBeenCalledWith({
        page: '1',
        perPage: '5',
        search: 'super'
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Successfuly got Superheroes!',
        data: mockResult
      });
    });

    it('should handle empty query parameters', async () => {
      const mockResult = {
        heroes: [],
        page: 1,
        perPage: 5,
        total: 0,
        totalPages: 0
      };
      
      mockReq.query = {};
      superheroesService.getHeroes.mockResolvedValue(mockResult);

      await getHeroesController(mockReq, mockRes);

      expect(superheroesService.getHeroes).toHaveBeenCalledWith({
        page: undefined,
        perPage: undefined,
        search: undefined
      });
      expect(mockRes.json).toHaveBeenCalledWith({
        status: 200,
        message: 'Successfuly got Superheroes!',
        data: mockResult
      });
    });
  });
});
