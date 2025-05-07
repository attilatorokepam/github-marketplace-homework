/* eslint-disable @typescript-eslint/unbound-method */
import { NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { PostsService } from '../posts.service';
import {
  mockCreatePostDto,
  mockPost,
  mockPosts,
  mockUpdatePostDto,
} from './mocks/post.mock';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(() => {
    service = new PostsService();
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all posts', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: mockPosts,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: '/posts' },
      });
      const result = await service.findAll();
      expect(result).toEqual(mockPosts);
    });

    it('should return an empty array if no posts', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [],
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: '/posts' },
      });
      const result = await service.findAll();
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: mockPost,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: '/posts/1' },
      });
      const result = await service.findOne(1);
      expect(result).toEqual(
        expect.objectContaining({
          id: mockPost.id,
          title: mockPost.title,
          body: mockPost.body,
          userId: mockPost.userId,
        }),
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('/posts/1'),
      );
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Not found'));
      await expect(service.findOne(-10)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a new post', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: mockPost,
        status: 201,
        statusText: 'Created',
        headers: {},
        config: { url: '/posts' },
      });
      const result = await service.create(mockCreatePostDto);
      expect(result).toEqual(mockPost);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/posts'),
        mockCreatePostDto,
      );
    });
  });

  describe('update', () => {
    it('should update and return the post', async () => {
      mockedAxios.put.mockResolvedValueOnce({
        data: { ...mockPost, ...mockUpdatePostDto },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: '/posts' },
      });
      const result = await service.update(1, mockUpdatePostDto);
      expect(result).toEqual({ ...mockPost, ...mockUpdatePostDto });
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/posts/1'),
        mockUpdatePostDto,
      );
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockedAxios.put.mockRejectedValueOnce(new Error('Not found'));
      await expect(service.update(999, mockUpdatePostDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete the post', async () => {
      mockedAxios.delete.mockResolvedValueOnce({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: { url: '/posts' },
      });
      await expect(service.remove(1)).resolves.toBeUndefined();
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/posts/1'),
      );
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockedAxios.delete.mockRejectedValueOnce(new Error('Not found'));
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
