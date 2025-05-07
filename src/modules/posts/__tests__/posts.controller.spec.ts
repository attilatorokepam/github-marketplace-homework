/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';
import {
  mockCreatePostDto,
  mockPost,
  mockPosts,
  mockUpdatePostDto,
} from './mocks/post.mock';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(mockPosts);
      const result = await controller.findAll();
      expect(result).toEqual(mockPosts);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(mockPost);
      const result = await controller.findOne('1');
      expect(result).toEqual(mockPost);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if post does not exist', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(undefined as unknown as typeof mockPost);
      await expect(controller.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create and return a new post', async () => {
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockPost);
      const result = await controller.create(mockCreatePostDto);
      expect(result).toEqual(mockPost);
      expect(service.create).toHaveBeenCalledWith(mockCreatePostDto);
    });
  });

  describe('update', () => {
    it('should update and return the post', async () => {
      jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce({ ...mockPost, ...mockUpdatePostDto });
      const result = await controller.update('1', mockUpdatePostDto);
      expect(result).toEqual({ ...mockPost, ...mockUpdatePostDto });
      expect(service.update).toHaveBeenCalledWith(1, mockUpdatePostDto);
    });
  });

  describe('remove', () => {
    it('should delete the post', async () => {
      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);
      await expect(controller.remove('1')).resolves.toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
