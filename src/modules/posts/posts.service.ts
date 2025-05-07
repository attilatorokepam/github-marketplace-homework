import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { CreatePostDto } from './dtos/create-post.dto';
import { Post } from './entities/post.entity';

const BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

@Injectable()
export class PostsService {
  async findAll(): Promise<Post[]> {
    const response = await axios.get<Post[]>(BASE_URL);
    return response.data;
  }

  async findOne(id: number): Promise<Post> {
    try {
      const response = await axios.get<Post>(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const response = await axios.post<Post>(BASE_URL, createPostDto);
    return response.data;
  }

  async update(
    id: number,
    updatePostDto: Partial<CreatePostDto>,
  ): Promise<Post> {
    try {
      const response = await axios.put<Post>(
        `${BASE_URL}/${id}`,
        updatePostDto,
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
      console.error(error);
      throw new NotFoundException(`Post with id ${id} not found`);
    }
  }
}
